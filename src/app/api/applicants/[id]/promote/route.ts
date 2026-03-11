import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashIdentityV2 } from "@/lib/password-identity-v2";

/** Promote to Intern: admin and IT only. */
const ROLES = ["admin", "IT"];

function randomUpperAlphaNum(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true }
> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** POST: promote applicant to intern (create user + intern, delete applicant). Body: { cwid, companyId, wage, semesterSeason, semesterYear }. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const applicantId = Number(idParam);
    if (Number.isNaN(applicantId)) {
      return NextResponse.json({ error: "Invalid applicant id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const cwid = typeof body.cwid === "string" ? body.cwid.trim() : "";
    const companyId = typeof body.companyId === "number" ? body.companyId : Number(body.companyId);
    const wageParam = typeof body.wage === "string" ? body.wage.trim() : String(body.wage ?? "");
    const semesterSeason = typeof body.semesterSeason === "string" ? body.semesterSeason.trim() : "";
    const semesterYear = typeof body.semesterYear === "string" ? body.semesterYear.trim() : String(body.semesterYear ?? "");

    const wage = Number(wageParam);
    if (!Number.isFinite(wage) || wage < 7.25) {
      return NextResponse.json({ error: "Wage must be at least 7.25" }, { status: 400 });
    }
    if (cwid.length !== 8) {
      return NextResponse.json({ error: "CWID must be exactly 8 characters" }, { status: 400 });
    }
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: "Valid company is required" }, { status: 400 });
    }

    const seasonMap: Record<string, string> = {
      Spring: "April",
      Summer: "July",
      Fall: "November",
    };
    const monthName = seasonMap[semesterSeason] ?? semesterSeason;
    const semesterStr = `${monthName} ${semesterYear}`;
    const semesterDate = new Date(semesterStr);
    if (Number.isNaN(semesterDate.getTime()) || semesterDate.getFullYear() < 2000) {
      return NextResponse.json({ error: "Valid semester (season and year) is required" }, { status: 400 });
    }

    const applicant = await prisma.applicants.findUnique({
      where: { Id: applicantId },
    });
    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    const company = await prisma.companies.findUnique({
      where: { Id: companyId },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 400 });
    }

    let lastNameClean = applicant.LastName ?? "";
    lastNameClean = lastNameClean.replace(/-/g, "").replace(/\s+/g, "");

    let role = await prisma.aspNetRoles.findFirst({
      where: { Name: "intern" },
    });
    if (!role) {
      role = await prisma.aspNetRoles.create({
        data: {
          Id: crypto.randomUUID(),
          Name: "intern",
        },
      });
    }

    const firstName = (applicant.FirstName ?? "").trim();
    const baseUsername =
      (firstName.charAt(0).toLowerCase() || "") + lastNameClean.toLowerCase();
    let username = baseUsername;
    let suffix = 0;
    while (true) {
      const existing = await prisma.aspNetUsers.findUnique({
        where: { UserName: username },
      });
      if (!existing) break;
      suffix += 1;
      username = baseUsername + suffix;
    }

    const plainPassword = randomUpperAlphaNum(12);
    const passwordHash = await hashIdentityV2(plainPassword);

    const userId = crypto.randomUUID();

    await prisma.$transaction(async (tx) => {
      await tx.aspNetUsers.create({
        data: {
          Id: userId,
          UserName: username,
          Email: applicant.Email ?? null,
          FirstName: applicant.FirstName ?? null,
          LastName: lastNameClean || (applicant.LastName ?? null),
          CompanyId: companyId,
          PasswordHash: passwordHash,
          EmailConfirmed: false,
          SecurityStamp: crypto.randomUUID(),
          PhoneNumber: applicant.Phone ?? null,
          PhoneNumberConfirmed: false,
          TwoFactorEnabled: false,
          LockoutEndDateUtc: null,
          LockoutEnabled: false,
          AccessFailedCount: 0,
        },
      });

      await tx.interns.create({
        data: {
          Id: userId,
          CWID: cwid,
          Major: applicant.Major ?? null,
          Minor: applicant.Minor ?? null,
          Level: applicant.Level ?? null,
          GradDate: applicant.GradDate,
          ResumeId: applicant.ResumeId ?? null,
          ContactName: applicant.ContactName ?? null,
          ContactRelationship: applicant.ContactRelationship ?? null,
          ContactPhone: applicant.ContactPhone ?? null,
          School: applicant.School ?? null,
          MentorName: "",
          MentorPhone: "",
          MentorEmail: "",
          MentorTitle: "",
          Street: applicant.Street ?? null,
          City: applicant.City ?? null,
          Zip: applicant.Zip ?? null,
          Apt: applicant.Apt ?? null,
          Wage: wage,
          Semester: semesterDate,
          State: applicant.State ?? null,
          Phone: applicant.Phone ?? null,
          Dob: applicant.Dob,
          Note: applicant.Note ?? null,
          HearAboutUs: applicant.HearAboutUs ?? null,
        },
      });

      await tx.aspNetUserRoles.create({
        data: { UserId: userId, RoleId: role!.Id },
      });

      await tx.applicants.delete({
        where: { Id: applicantId },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
