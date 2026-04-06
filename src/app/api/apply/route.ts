import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadResumeBlob } from "@/lib/azure-storage";
import { getSession, hasLoggedInUser } from "@/lib/auth";

function getSemesterLabels(): [string, string, string] {
  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  if (m <= 2) return [`Spring ${y}`, `Summer ${y}`, `Fall ${y}`];
  if (m <= 6) return [`Summer ${y}`, `Fall ${y}`, `Spring ${y + 1}`];
  if (m <= 9) return [`Fall ${y}`, `Spring ${y + 1}`, `Summer ${y + 1}`];
  return [`Spring ${y + 1}`, `Summer ${y + 1}`, `Fall ${y + 1}`];
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

const GRAD_MONTH_NUM: Record<string, number> = { may: 5, august: 8, december: 12 };
const SENTINEL = new Date(1900, 0, 1);

function parseDob(month: string, day: string): Date {
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) return SENTINEL;
  const date = new Date(2012, m - 1, d);
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return SENTINEL;
  return date;
}

function parseGradDate(monthStr: string, yearStr: string): Date {
  const m = GRAD_MONTH_NUM[monthStr.trim().toLowerCase()];
  const y = parseInt(yearStr.trim(), 10);
  if (!m || !y) return SENTINEL;
  return new Date(y, m - 1, 1);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (hasLoggedInUser(session)) {
      return NextResponse.json(
        { error: "Applications are only available when you are not logged in." },
        { status: 403 }
      );
    }

    const form = await request.formData();
    const s = (name: string) => ((form.get(name) as string) ?? "").trim();
    const has = (name: string) => form.get(name) !== null;

    const firstName = s("firstName");
    const lastName = s("lastName");
    const email = s("email");
    const phone = digitsOnly(s("phone"));
    const street = s("street");
    const apt = s("apt");
    const city = s("city");
    const state = s("StateList");
    const zip = s("zip");
    const contactName = s("emergencyName");
    const contactPhone = digitsOnly(s("emergencyPhone"));
    const contactRelationship = s("emergencyRelationship");
    const school = s("SchoolList");
    const rawMajor = s("MajorList");
    const major = rawMajor === "__none__" ? "" : rawMajor;
    const minor = s("minor");
    const level = s("LevelList");
    const foreignLanguage = s("ForeignLanguageList");
    const skills = s("skills");
    const preference = s("preference");
    const hearAboutUs = s("heardAbout");
    const validEmp = has("validEmp");
    const prevIntern = has("prevIntern");

    const dob = parseDob(s("DobMonth"), s("DobDay"));
    const gradDate = parseGradDate(s("GradMonth"), s("GradYear"));

    const [labelThis, labelNext, labelThird] = getSemesterLabels();
    const semParts: string[] = [];
    if (has("thisSemester")) semParts.push(labelThis);
    if (has("nextSemester")) semParts.push(labelNext);
    if (has("thirdSemester")) semParts.push(labelThird);
    const semester = semParts.join(", ");

    const locs = form.getAll("locations").map(String);
    const birmingham = locs.includes("Birmingham, AL");
    const huntsville = locs.includes("Huntsville, AL");
    const mobile = locs.includes("Mobile, AL");
    const montgomery = locs.includes("Montgomery, AL");
    const tuscaloosa = locs.includes("Tuscaloosa, AL");
    const annistonGadsden = locs.includes("Anniston/Gadsden, AL");
    const dothan = locs.includes("Dothan, AL");
    const blueSprings = locs.includes("Blue Springs, MS");
    const anyLoc = birmingham || huntsville || mobile || montgomery || tuscaloosa || annistonGadsden || dothan || blueSprings;

    const resumeFile = form.get("resume") as File | null;
    let resumeId = "404.txt";
    if (resumeFile && resumeFile.size > 0) {
      const ext = resumeFile.name.includes(".") ? resumeFile.name.slice(resumeFile.name.lastIndexOf(".")) : "";
      resumeId = `${crypto.randomUUID()}${ext}`;

      if (!process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING.includes("YOUR_ACCOUNT_KEY")) {
        return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
      }

      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      try {
        const uploadTimeout = 60_000;
        const uploadPromise = uploadResumeBlob(resumeId, buffer);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Upload timed out")), uploadTimeout)
        );
        await Promise.race([uploadPromise, timeoutPromise]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        return NextResponse.json({ error: `Resume upload failed: ${msg}` }, { status: 502 });
      }
    }

    const errors: Record<string, string> = {};
    if (firstName.length <= 1) errors.firstName = "First name is required.";
    if (lastName.length <= 1) errors.lastName = "Last name is required.";
    if (email.length <= 8) errors.email = "A valid email is required.";
    if (!school) errors.school = "School is required.";
    if (!major) errors.major = "Major is required.";
    if (!level) errors.level = "Level is required.";
    if (!semester) errors.semester = "At least one availability must be selected.";
    if (gradDate.getTime() < Date.now()) errors.gradDate = "Graduation date must be in the future.";
    if (!street) errors.street = "Street address is required.";
    if (!city) errors.city = "City is required.";
    if (state.length !== 2) errors.state = "State is required.";
    if (zip.length !== 5) errors.zip = "A 5-digit ZIP code is required.";
    if (contactName.length <= 1) errors.contactName = "Emergency contact name is required.";
    if (contactRelationship.length <= 1) errors.contactRelationship = "Emergency contact relationship is required.";
    if (contactPhone.length !== 10) errors.contactPhone = "Emergency contact phone must be 10 digits.";
    if (phone.length !== 10) errors.phone = "Phone must be 10 digits.";
    if (!anyLoc) errors.locations = "At least one location must be selected.";
    if (dob.getTime() === SENTINEL.getTime()) errors.dob = "A valid birthday is required.";
    if (resumeId === "404.txt") errors.resume = "A resume file is required.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Please correct the highlighted fields.", errors },
        { status: 400 }
      );
    }

    await prisma.applicants.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        Street: street,
        Apt: apt || null,
        City: city,
        State: state,
        Zip: zip,
        ContactName: contactName,
        ContactPhone: contactPhone,
        ContactRelationship: contactRelationship,
        Dob: dob,
        School: school,
        Major: major,
        Minor: minor || null,
        Level: level,
        GradDate: gradDate,
        ForeignLanguage: foreignLanguage || null,
        Skills: skills || "",
        Preference: preference || null,
        HearAboutUs: hearAboutUs || null,
        ValidEmp: validEmp,
        PrevIntern: prevIntern,
        Semester: semester,
        Birmingham: birmingham,
        Huntsville: huntsville,
        Mobile: mobile,
        Montgomery: montgomery,
        Tuscaloosa: tuscaloosa,
        AnnistonGadsden: annistonGadsden,
        Dothan: dothan,
        BlueSprings: blueSprings,
        ResumeId: resumeId,
        DateApplied: new Date(),
        Comment: "",
        InterviewStatus: false,
        CallBack: false,
        CallBackDate: SENTINEL,
        Note: null,
      },
    });

    return NextResponse.json({ ok: true, firstName });
  } catch (e) {
    console.error("Apply POST error:", e);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
