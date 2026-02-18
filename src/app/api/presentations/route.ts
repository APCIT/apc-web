import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadPresentationBlob } from "@/lib/azure-storage";

const PRESENTATIONS_ROLES = ["IT", "admin", "staff", "advisor", "reception"];
const IT_ONLY = ["IT"];

/** Map Semester DateTime to display label (e.g. "Spring 2025", "Fall 2022"). */
function semesterToLabel(d: Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  if (month >= 0 && month <= 4) return `Spring ${year}`;
  if (month >= 5 && month <= 6) return `Summer ${year}`;
  return `Fall ${year}`;
}

async function requirePresentationsAccess(requireIT: boolean): Promise<
  | { error: NextResponse }
  | { session: { userId: string; userName: string }; user: unknown; roles: string[] }
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
  const allowed = requireIT ? IT_ONLY : PRESENTATIONS_ROLES;
  if (!allowed.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, user, roles };
}

/** Map season string + year to Semester Date. Match C# controller: Spring=April, Summer=July, Fall=November. */
function parseSemester(season: string, yearStr: string): Date | null {
  const year = parseInt(yearStr, 10);
  if (!Number.isFinite(year) || year < 2000 || year > 2100) return null;
  const s = (season || "").trim().toLowerCase();
  let month = 3; // Spring = April (0-based: 3)
  if (s === "summer") month = 6; // July
  else if (s === "fall") month = 10; // November
  else if (s !== "spring") return null;
  return new Date(year, month, 1);
}

/** GET: all presentations ordered by Semester desc; distinct semesters come from this list. */
export async function GET() {
  try {
    const access = await requirePresentationsAccess(false);
    if ("error" in access) return access.error;

    const rows = await prisma.presentations.findMany({
      orderBy: { Semester: "desc" },
      select: {
        Id: true,
        Name: true,
        Semester: true,
        UploadDate: true,
        Uploader: true,
        Company: true,
      },
    });

    const presentations = rows.map((p) => ({
      id: p.Id,
      name: p.Name ?? "",
      semester: p.Semester.toISOString(),
      semesterLabel: semesterToLabel(p.Semester),
      uploadDate: p.UploadDate.toISOString(),
      uploader: p.Uploader ?? "",
      company: p.Company ?? "",
    }));

    return NextResponse.json(presentations);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST: create presentation (IT only). Accepts JSON: { presentationFileBase64, presentationFileName, presentationName, companyId, presentationSeason, presentationYear }. */
export async function POST(request: Request) {
  try {
    const access = await requirePresentationsAccess(true);
    if ("error" in access) return access.error;
    const { session } = access;

    const body = await request.json().catch(() => ({}));
    const name = typeof body.presentationName === "string" ? body.presentationName.trim() : "";
    const companyIdRaw = body.companyId;
    const companyId = typeof companyIdRaw === "number" ? companyIdRaw : typeof companyIdRaw === "string" ? parseInt(companyIdRaw, 10) : NaN;
    const season = typeof body.presentationSeason === "string" ? body.presentationSeason.trim() : "";
    const yearStr = typeof body.presentationYear === "string" ? body.presentationYear.trim() : String(body.presentationYear ?? "").trim();
    const fileBase64 = typeof body.presentationFileBase64 === "string" ? body.presentationFileBase64 : "";
    const fileName = typeof body.presentationFileName === "string" ? body.presentationFileName.trim() : "";

    if (!fileBase64 || !fileName) {
      return NextResponse.json({ error: "Please select a file to upload." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Name(s) is required." }, { status: 400 });
    }
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: "Please select a company." }, { status: 400 });
    }
    const semesterDate = parseSemester(season, yearStr);
    if (!semesterDate) {
      return NextResponse.json({ error: "Please select a valid semester (season and year)." }, { status: 400 });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(fileBase64, "base64");
    } catch {
      return NextResponse.json({ error: "Invalid file data." }, { status: 400 });
    }
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Please select a file to upload." }, { status: 400 });
    }

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING.includes("YOUR_ACCOUNT_KEY")) {
      return NextResponse.json(
        { error: "Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING with a valid key." },
        { status: 503 }
      );
    }

    const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
    const id = `${crypto.randomUUID()}${ext}`;

    const uploadTimeoutMs = 60_000;
    const uploadPromise = uploadPresentationBlob(id, buffer);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Storage upload timed out")), uploadTimeoutMs)
    );
    try {
      await Promise.race([uploadPromise, timeoutPromise]);
    } catch (blobErr) {
      const msg = blobErr instanceof Error ? blobErr.message : "Storage upload failed";
      return NextResponse.json(
        { error: msg === "Storage upload timed out" ? "Upload to storage timed out. Try again or check network." : `Storage upload failed: ${msg}` },
        { status: 502 }
      );
    }

    const company = await prisma.companies.findUnique({
      where: { Id: companyId },
      select: { Abbreviation: true },
    });
    const companyAbbreviation = company?.Abbreviation ?? "";

    await prisma.presentations.create({
      data: {
        Id: id,
        Name: name,
        Company: companyAbbreviation,
        Semester: semesterDate,
        UploadDate: new Date(),
        Uploader: session.userName ?? "",
      },
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
