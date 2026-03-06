import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

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
  return { ok: true, internId: intern.Id };
}

function isBlank(s: unknown): boolean {
  if (s == null) return true;
  if (typeof s === "string" && (s === "" || s === "null")) return true;
  return false;
}

function validate(
  startDate: string,
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string,
  lunch: number,
  description: string
): string | null {
  if (!startDate || isBlank(startHour) || isBlank(startMinute) || isBlank(endHour) || isBlank(endMinute)) {
    return "Date and times are required.";
  }
  if (!description?.trim()) return "Description is required.";
  const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
  const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  const start = new Date(`${startDate}T${startTime}:00.000Z`);
  const end = new Date(`${startDate}T${endTime}:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Invalid date/time.";
  if (end <= start) return "End time must be after start time.";
  if (lunch < 0) return "Lunch cannot be negative.";
  return null;
}

/** Sum (End - Start).TotalHours - Lunch for each timelog. */
function calcHours(
  timelogs: { Start: Date; End: Date; Lunch: number }[]
): number {
  let hours = 0;
  for (const t of timelogs) {
    const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
    const end = t.End instanceof Date ? t.End : new Date(t.End);
    hours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    hours -= t.Lunch ?? 0;
  }
  return hours;
}

type WeekRow = {
  Id?: string;
  Date: string;
  StartHour?: string | null;
  StartMinute?: string | null;
  EndHour?: string | null;
  EndMinute?: string | null;
  Description?: string | null;
  Lunch?: string | number | null;
};

/** POST: update current intern's week (create/update/delete timelogs). Body: { week: WeekRow[] }. Returns { hours: number }. */
export async function POST(request: NextRequest) {
  try {
    const access = await requireIntern();
    if ("error" in access) return access.error;
    const { internId } = access;

    const body = await request.json().catch(() => ({}));
    const week = body.week as WeekRow[] | undefined;
    if (!Array.isArray(week) || week.length === 0) {
      return NextResponse.json({ error: "week array required" }, { status: 400 });
    }

    // One timelog per (intern, date): for each day, find the single existing log if any, then update/delete or create one. Never add a second for the same day.
    for (const row of week) {
      const dateStr = typeof row.Date === "string" ? row.Date.trim() : "";
      if (!dateStr) continue;

      const dayStart = new Date(dateStr + "T00:00:00");
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      if (Number.isNaN(dayStart.getTime())) continue;

      const existing = await prisma.timelogs.findFirst({
        where: {
          Intern_Id: internId,
          Start: { gte: dayStart, lt: dayEnd },
        },
      });

      const startHour = row.StartHour;
      const startMinute = row.StartMinute;
      const endHour = row.EndHour;
      const endMinute = row.EndMinute;
      const description = typeof row.Description === "string" ? row.Description : "";
      const lunchRaw = row.Lunch;
      const lunchMinutes = lunchRaw === null || lunchRaw === undefined || lunchRaw === "" || String(lunchRaw) === "null"
        ? 0
        : Number(lunchRaw);
      const lunchHours = lunchMinutes / 60;

      const shouldClear =
        isBlank(startHour) ||
        isBlank(startMinute) ||
        isBlank(endHour) ||
        isBlank(endMinute) ||
        isBlank(description) ||
        (description !== null && description.trim() === "");

      if (existing) {
        if (shouldClear) {
          await prisma.timelogs.delete({ where: { Id: existing.Id } });
          continue;
        }
        const err = validate(
          dateStr,
          String(startHour ?? ""),
          String(startMinute ?? ""),
          String(endHour ?? ""),
          String(endMinute ?? ""),
          lunchHours,
          description
        );
        if (err) {
          return NextResponse.json({ error: `${dateStr}: ${err}` }, { status: 400 });
        }
        const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
        const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
        const start = new Date(`${dateStr}T${startTime}:00.000Z`);
        const end = new Date(`${dateStr}T${endTime}:00.000Z`);
        await prisma.timelogs.update({
          where: { Id: existing.Id },
          data: {
            Start: start,
            End: end,
            Description: description.trim(),
            Lunch: lunchHours,
          },
        });
      } else {
        if (shouldClear) continue;
        const err = validate(
          dateStr,
          String(startHour ?? ""),
          String(startMinute ?? ""),
          String(endHour ?? ""),
          String(endMinute ?? ""),
          lunchHours,
          description
        );
        if (err) {
          return NextResponse.json({ error: `${dateStr}: ${err}` }, { status: 400 });
        }
        const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
        const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
        const start = new Date(`${dateStr}T${startTime}:00.000Z`);
        const end = new Date(`${dateStr}T${endTime}:00.000Z`);
        await prisma.timelogs.create({
          data: {
            Id: randomUUID(),
            Start: start,
            End: end,
            Description: description.trim(),
            Lunch: lunchHours,
            Intern_Id: internId,
          },
        });
      }
    }

    const firstDate = week[0]?.Date;
    if (!firstDate || typeof firstDate !== "string") {
      return NextResponse.json({ hours: 0 });
    }
    const weekStart = new Date(firstDate + "T00:00:00");
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const timelogsInWeek = await prisma.timelogs.findMany({
      where: {
        Intern_Id: internId,
        Start: { gte: weekStart, lt: weekEnd },
      },
    });
    const totalHours = calcHours(timelogsInWeek);

    return NextResponse.json({
      hours: Math.round(totalHours * 100) / 100,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
