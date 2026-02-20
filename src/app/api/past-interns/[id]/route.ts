import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const PAST_INTERNS_ROLES = ["IT", "admin", "staff", "reception"];
const IT_ONLY = ["IT"];

async function requirePastInternsAccess(requireIT: boolean): Promise<
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
  const allowed = requireIT ? IT_ONLY : PAST_INTERNS_ROLES;
  if (!allowed.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

function semesterToLabel(d: Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  if (month === 11) return `Fall ${year}`;
  return `Semester ${year}`;
}

export type PastInternDetailItem = {
  id: number;
  cwid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  apt: string;
  gradDate: string;
  major: string;
  minor: string;
  level: string;
  semester: string;
  semesterLabel: string;
  company: string;
  school: string;
  wage: number;
  hrsWorked: number;
  mentorName: string;
  mentorPhone: string;
  mentorEmail: string;
  mentorTitle: string;
  note: string;
  hometown: string;
  hearAboutUs: string;
  midSemReportId: string | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

/** GET: one past intern by id (for Details page). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requirePastInternsAccess(false);
    if ("error" in access) return access.error;

    const id = parseInt((await params).id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const r = await prisma.pastInterns.findUnique({
      where: { Id: id },
    });
    if (!r) {
      return NextResponse.json({ error: "Past intern not found" }, { status: 404 });
    }

    const row = r as typeof r & { Minor?: string | null; Level?: string | null; Hometown?: string | null; HearAboutUs?: string | null };
    const pastIntern: PastInternDetailItem = {
      id: r.Id,
      cwid: r.CWID ?? "",
      firstName: r.FirstName ?? "",
      lastName: r.LastName ?? "",
      email: r.Email ?? "",
      phone: r.Phone ?? "",
      street: r.Street ?? "",
      city: r.City ?? "",
      state: r.State ?? "",
      zip: r.Zip ?? "",
      apt: r.Apt ?? "",
      gradDate: r.GradDate.toISOString(),
      major: r.Major ?? "",
      minor: row.Minor ?? "",
      level: row.Level ?? "",
      semester: r.Semester.toISOString(),
      semesterLabel: semesterToLabel(r.Semester),
      company: r.Company ?? "",
      school: r.School ?? "",
      wage: r.Wage,
      hrsWorked: r.HrsWorked,
      mentorName: r.MentorName ?? "",
      mentorPhone: r.MentorPhone ?? "",
      mentorEmail: r.MentorEmail ?? "",
      mentorTitle: r.MentorTitle ?? "",
      note: r.Note ?? "",
      hometown: row.Hometown ?? "",
      hearAboutUs: row.HearAboutUs ?? "",
      midSemReportId: r.MidSemReportId,
      impactCalcId: r.ImpactCalcId,
      presentationId: r.PresentationId,
    };

    return NextResponse.json(pastIntern);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE: remove past intern (IT only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requirePastInternsAccess(true);
    if ("error" in access) return access.error;

    const id = parseInt((await params).id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await prisma.pastInterns.delete({
      where: { Id: id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Past intern not found" }, { status: 404 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
