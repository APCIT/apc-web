import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isScheduleMidnight } from "@/lib/schedule-time";

/** Require session and intern role; return current user's intern. */
async function requireIntern(): Promise<
  | { error: NextResponse }
  | { ok: true; internId: string }
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
  if (!roles.includes("intern")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  const intern = await prisma.interns.findUnique({
    where: { Id: session.userId },
  });
  if (!intern) {
    return { error: NextResponse.json({ error: "Intern record not found" }, { status: 404 }) };
  }
  return { ok: true, internId: intern.Id };
}

/** Monday 00:00:00 of the week containing d. */
function startOfWeekMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** First week of semester: April (Spring) → Jan 15, July (Summer) → May 15, November (Fall) → Aug 15; then Monday of that week. */
function getSemesterWeekStart(semester: Date): Date {
  const d = semester instanceof Date ? semester : new Date(semester);
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();
  let anchor: Date;
  if (month === 4) {
    anchor = new Date(year, 0, 15);
  } else if (month === 7) {
    anchor = new Date(year, 4, 15);
  } else if (month === 11) {
    anchor = new Date(year, 7, 15);
  } else {
    anchor = new Date(year, 0, 15);
  }
  return startOfWeekMonday(anchor);
}

export type WorkScheduleDayItem = {
  id: string;
  day: string;
  dayName: string;
  startHour1: string;
  startMinute1: string;
  endHour1: string;
  endMinute1: string;
  startHour2: string;
  startMinute2: string;
  endHour2: string;
  endMinute2: string;
  hasSecondBlock: boolean;
};

export type WorkSchedulePageResponse = {
  internId: string;
  weekStart: string;
  days: WorkScheduleDayItem[];
};

/** GET: current intern's semester work schedule (first week Mon–Fri). */
export async function GET() {
  try {
    const access = await requireIntern();
    if ("error" in access) return access.error;
    const { internId } = access;

    const intern = await prisma.interns.findUnique({
      where: { Id: internId },
      include: { WorkSchedules: true },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const weekStart = getSemesterWeekStart(intern.Semester);
    const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const days: WorkScheduleDayItem[] = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dayStr = `${y}-${m}-${dd}`;
      const dayStart = new Date(dayStr + "T00:00:00.000Z");
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

      const existing = (intern.WorkSchedules ?? []).find((ws) => {
        const start = ws.Start instanceof Date ? ws.Start : new Date(ws.Start);
        return start.getTime() >= dayStart.getTime() && start.getTime() < dayEnd.getTime();
      });

      if (existing) {
        const start = existing.Start instanceof Date ? existing.Start : new Date(existing.Start);
        const end = existing.End instanceof Date ? existing.End : new Date(existing.End);
        const start2 = existing.Start2 instanceof Date ? existing.Start2 : new Date(existing.Start2);
        const end2 = existing.End2 instanceof Date ? existing.End2 : new Date(existing.End2);
        const has2 = !isScheduleMidnight(start2) && !isScheduleMidnight(end2);
        days.push({
          id: existing.Id,
          day: dayStr,
          dayName: DAY_NAMES[date.getDay()],
          startHour1: String(start.getUTCHours()).padStart(2, "0"),
          startMinute1: String(start.getUTCMinutes()).padStart(2, "0"),
          endHour1: String(end.getUTCHours()).padStart(2, "0"),
          endMinute1: String(end.getUTCMinutes()).padStart(2, "0"),
          startHour2: has2 ? String(start2.getUTCHours()).padStart(2, "0") : "",
          startMinute2: has2 ? String(start2.getUTCMinutes()).padStart(2, "0") : "",
          endHour2: has2 ? String(end2.getUTCHours()).padStart(2, "0") : "",
          endMinute2: has2 ? String(end2.getUTCMinutes()).padStart(2, "0") : "",
          hasSecondBlock: has2,
        });
      } else {
        days.push({
          id: "",
          day: dayStr,
          dayName: DAY_NAMES[date.getDay()],
          startHour1: "",
          startMinute1: "",
          endHour1: "",
          endMinute1: "",
          startHour2: "",
          startMinute2: "",
          endHour2: "",
          endMinute2: "",
          hasSecondBlock: false,
        });
      }
    }

    return NextResponse.json({
      internId,
      weekStart: weekStartStr,
      days,
    } as WorkSchedulePageResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
