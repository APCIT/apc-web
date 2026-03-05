import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ["IT", "admin"];

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true; roles: string[] }
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
  if (!ALLOWED_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, roles };
}

function validate(
  startDate: string,
  startTime: string,
  endTime: string,
  lunch: number,
  description: string
): string | null {
  if (!startDate || !startTime || !endTime) return "Date, start time, and end time are required.";
  if (!description?.trim()) return "Description is required.";

  const start = new Date(`${startDate}T${startTime}:00.000Z`);
  const end = new Date(`${startDate}T${endTime}:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Invalid date/time.";
  if (end <= start) return "End time must be after start time.";
  if (lunch < 0) return "Lunch cannot be negative.";

  return null;
}

/** POST: create a new timelog for this intern. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const internId = (await params).id;
    const intern = await prisma.interns.findUnique({ where: { Id: internId } });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const body = await request.json();
    const { date, startTime, endTime, lunch, description } = body as {
      date: string;
      startTime: string;
      endTime: string;
      lunch: number;
      description: string;
    };

    const lunchHours = (lunch ?? 0) / 60;
    const err = validate(date, startTime, endTime, lunchHours, description);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const start = new Date(`${date}T${startTime}:00.000Z`);
    const end = new Date(`${date}T${endTime}:00.000Z`);

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT: update an existing timelog. */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const internId = (await params).id;
    const body = await request.json();
    const { timelogId, date, startTime, endTime, lunch, description } = body as {
      timelogId: string;
      date: string;
      startTime: string;
      endTime: string;
      lunch: number;
      description: string;
    };

    if (!timelogId) return NextResponse.json({ error: "Timelog id required." }, { status: 400 });

    const lunchHours = (lunch ?? 0) / 60;
    const err = validate(date, startTime, endTime, lunchHours, description);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const timelog = await prisma.timelogs.findUnique({ where: { Id: timelogId } });
    if (!timelog || timelog.Intern_Id !== internId) {
      return NextResponse.json({ error: "Timelog not found" }, { status: 404 });
    }

    const start = new Date(`${date}T${startTime}:00.000Z`);
    const end = new Date(`${date}T${endTime}:00.000Z`);

    await prisma.timelogs.update({
      where: { Id: timelogId },
      data: {
        Start: start,
        End: end,
        Description: description.trim(),
        Lunch: lunchHours,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE: remove the timelog for this intern on the given date. Query: date=yyyy-MM-dd */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const internId = (await params).id;
    const dateParam = request.nextUrl.searchParams.get("date")?.trim();
    if (!dateParam) {
      return NextResponse.json({ error: "date query (yyyy-MM-dd) required" }, { status: 400 });
    }

    const dayStart = new Date(dateParam + "T00:00:00");
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    if (Number.isNaN(dayStart.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const timelog = await prisma.timelogs.findFirst({
      where: {
        Intern_Id: internId,
        Start: { gte: dayStart, lt: dayEnd },
      },
    });
    if (!timelog) {
      return NextResponse.json({ error: "Timelog not found" }, { status: 404 });
    }

    await prisma.timelogs.delete({ where: { Id: timelog.Id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
