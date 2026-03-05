import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatScheduleTime, isScheduleMidnight } from "@/lib/schedule-time";

/** Same roles as Interns list. Client may only view interns from their company. */
const ROLES = ["IT", "admin", "staff", "reception", "client", "accountant"];

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true; roles: string[]; companyId: number | null }
> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: {
      AspNetUserRoles: { include: { AspNetRoles: true } },
      Companies: true,
    },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, roles, companyId: user.CompanyId ?? null };
}

/** Sunday at 00:00:00 local. */
function startOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Sum (End - Start).TotalHours - Lunch for each timelog. */
function calcHours(
  timelogs: { Start: Date; End: Date; Lunch: number }[]
): number {
  let hours = 0;
  let lunchHours = 0;
  for (const t of timelogs) {
    const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
    const end = t.End instanceof Date ? t.End : new Date(t.End);
    hours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    lunchHours += t.Lunch ?? 0;
  }
  return hours - lunchHours;
}

function semesterToLabel(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 11) return `Fall ${year}`;
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  return "";
}

function gradDateToLabel(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 12) return `Fall ${year}`;
  if (month === 5) return `Spring ${year}`;
  if (month === 8) return `Summer ${year}`;
  return "";
}

export type TimelogEntry = {
  id: string;
  start: string;
  end: string;
  description: string | null;
  lunch: number;
  hours: number;
};

export type InternDetailItem = {
  id: string;
  cwid: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  companyName: string;
  companyId: number | null;
  semester: string;
  level: string | null;
  gradDate: string;
  gradDateIso: string | null;
  wage: number;
  dob: string;
  major: string | null;
  minor: string | null;
  school: string | null;
  department: string | null;
  mentorName: string | null;
  mentorTitle: string | null;
  mentorPhone: string | null;
  mentorEmail: string | null;
  note: string | null;
  street: string | null;
  apt: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  hometown: string | null;
  contactName: string | null;
  contactRelationship: string | null;
  contactPhone: string | null;
  resumeId: string | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

export type WorkScheduleEntry = {
  day: string;
  startDisplay: string;
  endDisplay: string;
  start2Display: string | null;
  end2Display: string | null;
};

export type InternDetailsResponse = {
  intern: InternDetailItem;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalPeriodHours: number;
  totalAllTimeHours: number;
  thisWeek: TimelogEntry[];
  workSchedule: WorkScheduleEntry[];
};

/** GET: one intern by id (Details page). Query: date=yyyy-MM-dd (optional, week's Sunday). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;
    const { roles, companyId } = access;

    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const dateParam = request.nextUrl.searchParams.get("date")?.trim();
    let weekStart: Date;
    if (dateParam) {
      const parsed = new Date(dateParam + "T00:00:00");
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid date (use yyyy-MM-dd)" }, { status: 400 });
      }
      weekStart = startOfWeek(parsed);
    } else {
      weekStart = startOfWeek(new Date());
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

    if (roles.includes("client") && companyId != null) {
      if (intern.AspNetUsers?.CompanyId !== companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const weekStartTime = weekStart.getTime();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndTime = weekEnd.getTime();

    const timelogsInWeek = (intern.Timelogs ?? []).filter((t) => {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      return startDate >= weekStartTime && startDate < weekEndTime;
    });

    const totalHours = calcHours(timelogsInWeek);

    const periodStart = new Date(weekStart);
    periodStart.setDate(periodStart.getDate() - 7);
    const periodStartTime = periodStart.getTime();
    const timelogsInPeriod = (intern.Timelogs ?? []).filter((t) => {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      return startDate >= periodStartTime && startDate < weekEndTime;
    });
    const totalPeriodHours = calcHours(timelogsInPeriod);

    const totalAllTimeHours = calcHours(intern.Timelogs ?? []);

    const thisWeek: TimelogEntry[] = timelogsInWeek.map((t) => {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      const hrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (t.Lunch ?? 0);
      return {
        id: t.Id,
        start: t.Start instanceof Date ? t.Start.toISOString() : String(t.Start),
        end: t.End instanceof Date ? t.End.toISOString() : String(t.End),
        description: t.Description ?? null,
        lunch: t.Lunch ?? 0,
        hours: Math.round(hrs * 100) / 100,
      };
    });

    const internDetail: InternDetailItem = {
      id: intern.Id,
      cwid: intern.CWID ?? null,
      firstName: intern.AspNetUsers?.FirstName ?? "",
      lastName: intern.AspNetUsers?.LastName ?? "",
      email: intern.AspNetUsers?.Email ?? null,
      phone: intern.Phone ?? null,
      companyName: intern.AspNetUsers?.Companies?.Name ?? "",
      companyId: intern.AspNetUsers?.CompanyId ?? null,
      semester: semesterToLabel(intern.Semester),
      level: intern.Level ?? null,
      gradDate: gradDateToLabel(intern.GradDate),
      gradDateIso:
        intern.GradDate instanceof Date
          ? intern.GradDate.toISOString()
          : null,
      wage: intern.Wage ?? 0,
      dob: intern.Dob instanceof Date ? intern.Dob.toISOString() : String(intern.Dob),
      major: intern.Major ?? null,
      minor: intern.Minor ?? null,
      school: intern.School ?? null,
      department: intern.Department ?? null,
      mentorName: intern.MentorName ?? null,
      mentorTitle: intern.MentorTitle ?? null,
      mentorPhone: intern.MentorPhone ?? null,
      mentorEmail: intern.MentorEmail ?? null,
      note: intern.Note ?? null,
      street: intern.Street ?? null,
      apt: intern.Apt ?? null,
      city: intern.City ?? null,
      state: intern.State ?? null,
      zip: intern.Zip ?? null,
      hometown: intern.Hometown ?? null,
      contactName: intern.ContactName ?? null,
      contactRelationship: intern.ContactRelationship ?? null,
      contactPhone: intern.ContactPhone ?? null,
      resumeId: intern.ResumeId ?? null,
      impactCalcId: intern.ImpactCalcId ?? null,
      presentationId: intern.PresentationId ?? null,
    };

    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const scheduleByDay = new Map<number, typeof intern.WorkSchedules[number]>();
    for (const ws of intern.WorkSchedules ?? []) {
      const start = ws.Start instanceof Date ? ws.Start : new Date(ws.Start);
      const dow = start.getUTCDay();
      if (dow >= 1 && dow <= 5) {
        scheduleByDay.set(dow, ws);
      }
    }

    const workSchedule: WorkScheduleEntry[] = [];
    for (let dow = 1; dow <= 5; dow++) {
      const ws = scheduleByDay.get(dow);
      if (ws) {
        const start = ws.Start instanceof Date ? ws.Start : new Date(ws.Start);
        const end = ws.End instanceof Date ? ws.End : new Date(ws.End);
        const start2 = ws.Start2 instanceof Date ? ws.Start2 : new Date(ws.Start2);
        const end2 = ws.End2 instanceof Date ? ws.End2 : new Date(ws.End2);
        workSchedule.push({
          day: DAY_NAMES[dow],
          startDisplay: formatScheduleTime(start),
          endDisplay: formatScheduleTime(end),
          start2Display: isScheduleMidnight(start2) ? null : formatScheduleTime(start2),
          end2Display: isScheduleMidnight(end2) ? null : formatScheduleTime(end2),
        });
      } else {
        workSchedule.push({
          day: DAY_NAMES[dow],
          startDisplay: "",
          endDisplay: "",
          start2Display: null,
          end2Display: null,
        });
      }
    }

    return NextResponse.json({
      intern: internDetail,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      totalHours: Math.round(totalHours * 100) / 100,
      totalPeriodHours: Math.round(totalPeriodHours * 100) / 100,
      totalAllTimeHours: Math.round(totalAllTimeHours * 100) / 100,
      thisWeek,
      workSchedule,
    } as InternDetailsResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
