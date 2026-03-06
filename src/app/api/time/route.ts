import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Sunday 00:00:00 local. */
function startOfWeek(d: Date): Date {
  const result = new Date(d);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Format date as yyyy-MM-dd in UTC (so saved timelog day matches the row we show). */
function toUtcDateStr(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Require session and intern role; return current user's intern id. */
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
  return { ok: true, internId: intern!.Id };
}

export type TimelogEntry = {
  id: string;
  start: string;
  end: string;
  description: string | null;
  lunch: number;
  hours: number;
};

export type TimeWeekResponse = {
  weekStart: string;
  weekEnd: string;
  thisWeek: TimelogEntry[];
  currentWeek: boolean;
  nextWeek: boolean;
  intern: {
    id: string;
    hometown: string | null;
    mentorName: string | null;
    mentorTitle: string | null;
    mentorPhone: string | null;
    mentorEmail: string | null;
  };
};

/** GET: current intern's week timelogs. Query: date=yyyy-MM-dd (optional, week's Sunday). */
export async function GET(request: NextRequest) {
  try {
    const access = await requireIntern();
    if ("error" in access) return access.error;
    const { internId } = access;

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
      where: { Id: internId },
      include: { Timelogs: true },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const DAY_MS = 24 * 60 * 60 * 1000;
    const weekDateStrs: string[] = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart.getTime() + i * DAY_MS);
      weekDateStrs.push(
        `${dayStart.getFullYear()}-${String(dayStart.getMonth() + 1).padStart(2, "0")}-${String(dayStart.getDate()).padStart(2, "0")}`
      );
    }
    const weekDateSet = new Set(weekDateStrs);

    const timelogsInWeek = (intern.Timelogs ?? []).filter((t) => {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const utcStr = toUtcDateStr(start);
      return weekDateSet.has(utcStr);
    });

    const now = new Date();
    const currentSunday = startOfWeek(now);
    const currentWeek = currentSunday.getTime() === weekStart.getTime();
    const nextWeek = weekStart.getTime() < currentSunday.getTime();

    const thisWeek: TimelogEntry[] = [];
    for (let i = 0; i < 7; i++) {
      const dayStr = weekDateStrs[i];
      const tl = timelogsInWeek.find((t) => {
        const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
        return toUtcDateStr(start) === dayStr;
      });
      if (tl) {
        const start = tl.Start instanceof Date ? tl.Start : new Date(tl.Start);
        const end = tl.End instanceof Date ? tl.End : new Date(tl.End);
        const hrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (tl.Lunch ?? 0);
        thisWeek.push({
          id: tl.Id,
          start: tl.Start instanceof Date ? tl.Start.toISOString() : String(tl.Start),
          end: tl.End instanceof Date ? tl.End.toISOString() : String(tl.End),
          description: tl.Description ?? null,
          lunch: tl.Lunch ?? 0,
          hours: Math.round(hrs * 100) / 100,
        });
      } else {
        thisWeek.push({
          id: "",
          start: "",
          end: "",
          description: null,
          lunch: 0,
          hours: 0,
        });
      }
    }

    const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    return NextResponse.json({
      weekStart: weekStartStr,
      weekEnd: `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, "0")}-${String(weekEnd.getDate()).padStart(2, "0")}`,
      thisWeek,
      currentWeek,
      nextWeek,
      intern: {
        id: intern.Id,
        hometown: intern.Hometown ?? null,
        mentorName: intern.MentorName ?? null,
        mentorTitle: intern.MentorTitle ?? null,
        mentorPhone: intern.MentorPhone ?? null,
        mentorEmail: intern.MentorEmail ?? null,
      },
    } as TimeWeekResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
