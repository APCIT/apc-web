import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

const APPLICANTS_ROLES = ["admin", "IT", "staff", "reception"];

async function requireApplicantsAccess(): Promise<
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
  if (!APPLICANTS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** Map form city value to DB location field (or null for no filter). */
function cityToLocation(city: string | null): Record<string, boolean> | null {
  if (!city?.trim()) return null;
  const c = city.trim();
  switch (c) {
    case "Birmingham":
      return { Birmingham: true };
    case "Huntsville":
      return { Huntsville: true };
    case "Mobile":
      return { Mobile: true };
    case "Montgomery":
      return { Montgomery: true };
    case "Tuscaloosa":
      return { Tuscaloosa: true };
    case "Anniston Gadsden":
    case "Anniston/Gadsden":
      return { AnnistonGadsden: true };
    case "Dothan":
      return { Dothan: true };
    case "Blue Springs":
      return { BlueSprings: true };
    default:
      return null;
  }
}

/** Parse gradMonth (05|08|12) and gradYear into one or three dates (year-only = May, Aug, Dec). */
function parseGradDates(gradMonth: string | null, gradYear: string | null): Date[] | null {
  const year = gradYear?.trim() ? parseInt(gradYear.trim(), 10) : NaN;
  if (Number.isNaN(year)) return null;
  const month = gradMonth?.trim();
  if (month === "05") return [new Date(year, 4, 1)];
  if (month === "08") return [new Date(year, 7, 1)];
  if (month === "12") return [new Date(year, 11, 1)];
  // Year only: May, Aug, Dec
  return [
    new Date(year, 4, 1),
    new Date(year, 7, 1),
    new Date(year, 11, 1),
  ];
}

export type ApplicantSearchRow = {
  id: number;
  interviewStatus: boolean;
  callBack: boolean;
  callBackDate: string;
  prevIntern: boolean;
  note: string | null;
  firstName: string | null;
  validEmp: boolean;
  dateApplied: string;
  lastName: string | null;
  major: string | null;
  school: string | null;
  level: string | null;
  gradDate: string;
  skills: string | null;
  foreignLanguage: string | null;
  resumeId: string | null;
  semester: string | null;
  city: string | null;
  minor: string | null;
  email: string | null;
};

/** GET: applicant search. Query params: firstName, lastName, major, minor, level, semester, city, foreignLanguage, skills, gradMonth, gradYear. Order: PrevIntern asc, GradDate asc. */
export async function GET(request: Request) {
  try {
    const access = await requireApplicantsAccess();
    if ("error" in access) return access.error;

    const { searchParams } = new URL(request.url);
    const get = (pascal: string, camel: string) =>
      searchParams.get(pascal)?.trim() ?? searchParams.get(camel)?.trim() ?? "";
    const firstName = get("FirstName", "firstName");
    const lastName = get("LastName", "lastName");
    const school = get("School", "school");
    const major = get("Major", "major");
    const minor = get("Minor", "minor");
    const level = get("Level", "level");
    const semester = get("Semester", "semester");
    const city = get("City", "city");
    const foreignLanguage = get("ForeignLanguage", "foreignLanguage");
    const skills = get("Skills", "skills");
    const gradMonth = get("GradMonth", "gradMonth");
    const gradYear = get("GradYear", "gradYear");

    const locationFilter = cityToLocation(city || null);
    const gradDates = parseGradDates(gradMonth || null, gradYear || null);

    const where: Prisma.ApplicantsWhereInput = {};

    if (locationFilter) {
      Object.assign(where, locationFilter);
    }
    if (school) {
      (where as Prisma.ApplicantsWhereInput).School = school;
    }
    // SQL Server does not support mode: "insensitive"; use contains only (DB collation may still be case-insensitive).
    if (firstName) {
      (where as Prisma.ApplicantsWhereInput).FirstName = { contains: firstName };
    }
    if (lastName) {
      (where as Prisma.ApplicantsWhereInput).LastName = { contains: lastName };
    }
    if (major) {
      (where as Prisma.ApplicantsWhereInput).Major = major;
    }
    if (minor) {
      (where as Prisma.ApplicantsWhereInput).Minor = { contains: minor };
    }
    if (level) {
      (where as Prisma.ApplicantsWhereInput).Level = level;
    }
    if (semester) {
      (where as Prisma.ApplicantsWhereInput).Semester = { contains: semester };
    }
    if (foreignLanguage) {
      (where as Prisma.ApplicantsWhereInput).ForeignLanguage = foreignLanguage;
    }
    if (skills) {
      (where as Prisma.ApplicantsWhereInput).Skills = { contains: skills };
    }
    if (gradDates && gradDates.length > 0) {
      if (gradDates.length === 1) {
        (where as Prisma.ApplicantsWhereInput).GradDate = gradDates[0];
      } else {
        (where as Prisma.ApplicantsWhereInput).OR = gradDates.map((d) => ({ GradDate: d }));
      }
    }

    const rows = await prisma.applicants.findMany({
      where,
      orderBy: [{ PrevIntern: "asc" }, { GradDate: "asc" }],
    });

    const applicants: ApplicantSearchRow[] = rows.map((r) => ({
      id: r.Id,
      interviewStatus: r.InterviewStatus,
      callBack: r.CallBack,
      callBackDate: r.CallBackDate.toISOString(),
      prevIntern: r.PrevIntern,
      note: r.Note,
      firstName: r.FirstName,
      validEmp: r.ValidEmp ?? false,
      dateApplied: r.DateApplied.toISOString(),
      lastName: r.LastName,
      major: r.Major,
      school: r.School,
      level: r.Level,
      gradDate: r.GradDate.toISOString(),
      skills: r.Skills,
      foreignLanguage: r.ForeignLanguage,
      resumeId: r.ResumeId,
      semester: r.Semester,
      city: r.City,
      minor: r.Minor,
      email: r.Email,
    }));

    return NextResponse.json({
      applicants,
      count: applicants.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
