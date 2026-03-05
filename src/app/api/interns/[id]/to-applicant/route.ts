import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ROLES = ["IT"];

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
  const roleNames = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES.some((r) => roleNames.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** POST: archive intern to PastIntern, create Applicant (PrevIntern=true), delete timelogs/schedules/intern/user. */
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

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: {
        AspNetUsers: { include: { Companies: true } },
        Timelogs: true,
        WorkSchedules: true,
      },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    let totalHours = 0;
    for (const t of intern.Timelogs ?? []) {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (t.Lunch ?? 0);
    }
    totalHours = Math.round(totalHours * 100) / 100;

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
      await tx.interns.delete({ where: { Id: id } });
      await tx.applicants.create({
        data: {
          FirstName: intern.AspNetUsers?.FirstName ?? null,
          LastName: intern.AspNetUsers?.LastName ?? null,
          Email: intern.AspNetUsers?.Email ?? null,
          Phone: intern.Phone ?? null,
          Major: intern.Major ?? null,
          Minor: intern.Minor ?? null,
          Level: intern.Level ?? null,
          School: intern.School ?? null,
          GradDate: intern.GradDate,
          ResumeId: intern.ResumeId ?? null,
          Street: intern.Street ?? null,
          City: intern.City ?? null,
          State: intern.State ?? null,
          Zip: intern.Zip ?? null,
          Apt: intern.Apt ?? null,
          ContactName: intern.ContactName ?? null,
          ContactRelationship: intern.ContactRelationship ?? null,
          ContactPhone: intern.ContactPhone ?? null,
          Dob: intern.Dob,
          Note: intern.Note ?? null,
          PrevIntern: true,
          DateApplied: new Date(),
        },
      });
    });

    await prisma.aspNetUserRoles.deleteMany({ where: { UserId: id } });
    await prisma.aspNetUserLogins.deleteMany({ where: { UserId: id } });
    await prisma.aspNetUsers.delete({ where: { Id: id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
