import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ROLES = ["admin", "IT"];

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

const VALID_MONTHS: Record<string, number> = {
  April: 3,
  July: 6,
  November: 10,
};

/**
 * POST: archive current intern stint as PastIntern, update for new semester.
 * Body: { semesterSeason: "April"|"July"|"November", semesterYear: number, wage: number, companyId: number }
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const id = (await params).id;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await _request.json().catch(() => ({}));
    const semesterSeason = typeof body.semesterSeason === "string" ? body.semesterSeason.trim() : "";
    const semesterYear = typeof body.semesterYear === "number" ? body.semesterYear : 0;
    const wage = typeof body.wage === "number" ? body.wage : -1;
    const companyId = typeof body.companyId === "number" ? body.companyId : 0;

    const monthIndex = VALID_MONTHS[semesterSeason];
    if (monthIndex === undefined) {
      return NextResponse.json({ error: "Please select a valid semester season." }, { status: 400 });
    }
    const currentYear = new Date().getFullYear();
    if (semesterYear < currentYear || semesterYear > currentYear + 1) {
      return NextResponse.json({ error: "Please select a valid year." }, { status: 400 });
    }
    if (wage < 7.25) {
      return NextResponse.json({ error: "Wage must be at least $7.25." }, { status: 400 });
    }
    if (companyId <= 0) {
      return NextResponse.json({ error: "Please select a company." }, { status: 400 });
    }

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: {
        AspNetUsers: { include: { Companies: true } },
        Timelogs: true,
      },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const company = await prisma.companies.findUnique({ where: { Id: companyId } });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let totalHours = 0;
    for (const t of intern.Timelogs ?? []) {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (t.Lunch ?? 0);
    }
    totalHours = Math.round(totalHours * 100) / 100;

    const newSemesterDate = new Date(Date.UTC(semesterYear, monthIndex, 1));

    await prisma.$transaction(async (tx) => {
      await tx.pastInterns.create({
        data: {
          CWID: intern.CWID ?? null,
          FirstName: intern.AspNetUsers?.FirstName ?? null,
          LastName: intern.AspNetUsers?.LastName ?? null,
          Email: intern.AspNetUsers?.Email ?? null,
          Phone: intern.Phone ?? null,
          Company: intern.AspNetUsers?.Companies?.Abbreviation ?? null,
          Major: intern.Major ?? null,
          Minor: intern.Minor ?? null,
          Level: intern.Level ?? null,
          School: intern.School ?? null,
          Semester: intern.Semester,
          GradDate: intern.GradDate,
          Wage: intern.Wage ?? 0,
          HrsWorked: totalHours,
          MentorName: intern.MentorName ?? null,
          MentorPhone: intern.MentorPhone ?? null,
          MentorEmail: intern.MentorEmail ?? null,
          MentorTitle: intern.MentorTitle ?? null,
          ImpactCalcId: intern.ImpactCalcId ?? null,
          MidSemReportId: intern.MidSemReportId ?? null,
          PresentationId: intern.PresentationId ?? null,
          Note: intern.Note ?? null,
          Street: intern.Street ?? null,
          City: intern.City ?? null,
          State: intern.State ?? null,
          Zip: intern.Zip ?? null,
          Apt: intern.Apt ?? null,
          Hometown: intern.Hometown ?? null,
          HearAboutUs: intern.HearAboutUs ?? null,
        },
      });

      await tx.timelogs.deleteMany({ where: { Intern_Id: id } });
      await tx.workSchedules.deleteMany({ where: { Intern_Id: id } });

      await tx.interns.update({
        where: { Id: id },
        data: {
          MentorName: "",
          MentorEmail: "",
          MentorPhone: "",
          MentorTitle: "",
          Note: null,
          ImpactCalcId: null,
          PresentationId: null,
          Semester: newSemesterDate,
          Wage: wage,
        },
      });

      await tx.aspNetUsers.update({
        where: { Id: id },
        data: { CompanyId: companyId },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
