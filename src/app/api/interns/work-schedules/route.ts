import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatScheduleTime, isScheduleMidnight } from "@/lib/schedule-time";

/** Same roles as ScheduleDisplay page: IT, admin, staff. */
const ROLES = ["IT", "admin", "staff"];

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

/** Monday=1 .. Friday=5 (JavaScript: Sun=0, Mon=1, ... Sat=6). */
const WEEKDAY_JS = [1, 2, 3, 4, 5];

const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export type WorkScheduleDisplayItem = {
  id: string;
  dayOfWeek: number;
  firstName: string;
  lastName: string;
  companyName: string;
  startDisplay: string;
  endDisplay: string;
  start2Display: string | null;
  end2Display: string | null;
};

export type WorkSchedulesResponse = {
  daysOfWeek: string[];
  workSchedules: WorkScheduleDisplayItem[];
};

/** GET: weekday work schedules for ScheduleDisplay. Ordered by Company → Start → End → LastName → FirstName. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.workSchedules.findMany({
      include: {
        Interns: {
          include: {
            AspNetUsers: {
              include: { Companies: true },
            },
          },
        },
      },
    });

    const weekdayRows = rows.filter((r) => {
      const start = r.Start instanceof Date ? r.Start : new Date(r.Start);
      const day = start.getUTCDay();
      return WEEKDAY_JS.includes(day);
    });

    const sorted = [...weekdayRows].sort((a, b) => {
      const companyA = a.Interns?.AspNetUsers?.Companies?.Name ?? "";
      const companyB = b.Interns?.AspNetUsers?.Companies?.Name ?? "";
      const c = companyA.localeCompare(companyB);
      if (c !== 0) return c;
      const tA = a.Start instanceof Date ? a.Start.getTime() : new Date(a.Start).getTime();
      const tB = b.Start instanceof Date ? b.Start.getTime() : new Date(b.Start).getTime();
      if (tA !== tB) return tA - tB;
      const eA = a.End instanceof Date ? a.End.getTime() : new Date(a.End).getTime();
      const eB = b.End instanceof Date ? b.End.getTime() : new Date(b.End).getTime();
      if (eA !== eB) return eA - eB;
      const lastA = a.Interns?.AspNetUsers?.LastName ?? "";
      const lastB = b.Interns?.AspNetUsers?.LastName ?? "";
      const lastC = lastA.localeCompare(lastB);
      if (lastC !== 0) return lastC;
      const firstA = a.Interns?.AspNetUsers?.FirstName ?? "";
      const firstB = b.Interns?.AspNetUsers?.FirstName ?? "";
      return firstA.localeCompare(firstB);
    });

    const distinctDays = new Set<number>();
    for (const r of sorted) {
      const start = r.Start instanceof Date ? r.Start : new Date(r.Start);
      distinctDays.add(start.getUTCDay());
    }
    const dayOrder = [1, 2, 3, 4, 5];
    const daysOfWeek = dayOrder.filter((d) => distinctDays.has(d)).map((d) => DAY_NAMES[d]);

    const workSchedules: WorkScheduleDisplayItem[] = sorted.map((r) => {
      const start = r.Start instanceof Date ? r.Start : new Date(r.Start);
      const end = r.End instanceof Date ? r.End : new Date(r.End);
      const start2 = r.Start2 instanceof Date ? r.Start2 : new Date(r.Start2);
      const end2 = r.End2 instanceof Date ? r.End2 : new Date(r.End2);
      return {
        id: r.Id,
        dayOfWeek: start.getUTCDay(),
        firstName: r.Interns?.AspNetUsers?.FirstName ?? "",
        lastName: r.Interns?.AspNetUsers?.LastName ?? "",
        companyName: r.Interns?.AspNetUsers?.Companies?.Name ?? "",
        startDisplay: formatScheduleTime(start),
        endDisplay: formatScheduleTime(end),
        start2Display: isScheduleMidnight(start2) ? null : formatScheduleTime(start2),
        end2Display: isScheduleMidnight(end2) ? null : formatScheduleTime(end2),
      };
    });

    return NextResponse.json({
      daysOfWeek,
      workSchedules,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
