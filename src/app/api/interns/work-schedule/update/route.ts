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

/** Midnight sentinel for unused Start2/End2 (DB default). */
const MIDNIGHT_SENTINEL = new Date("1900-01-01T00:00:00.000Z");

function validateBlock(
  dayStr: string,
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string
): string | null {
  if (isBlank(startHour) || isBlank(startMinute) || isBlank(endHour) || isBlank(endMinute)) {
    return null;
  }
  const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
  const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  const start = new Date(`${dayStr}T${startTime}:00.000Z`);
  const end = new Date(`${dayStr}T${endTime}:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Invalid time.";
  if (end <= start) return "End time must be after start time.";
  return null;
}

type WorkScheduleRow = {
  Id?: string;
  Day: string;
  StartHour1?: string | null;
  StartMinute1?: string | null;
  EndHour1?: string | null;
  EndMinute1?: string | null;
  StartHour2?: string | null;
  StartMinute2?: string | null;
  EndHour2?: string | null;
  EndMinute2?: string | null;
};

/** POST: update current intern's semester work schedule (create/update/delete WorkSchedules). Body: { week: WorkScheduleRow[] }. */
export async function POST(request: NextRequest) {
  try {
    const access = await requireIntern();
    if ("error" in access) return access.error;
    const { internId } = access;

    const body = await request.json().catch(() => ({}));
    const week = body.week as WorkScheduleRow[] | undefined;
    if (!Array.isArray(week) || week.length === 0) {
      return NextResponse.json({ error: "week array required" }, { status: 400 });
    }

    let anyProcessed = false;

    for (const row of week) {
      const dayStr = typeof row.Day === "string" ? row.Day.trim() : "";
      if (!dayStr) continue;

      const dayStart = new Date(dayStr + "T00:00:00.000Z");
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
      if (Number.isNaN(dayStart.getTime())) continue;

      const existing = await prisma.workSchedules.findFirst({
        where: {
          Intern_Id: internId,
          Start: { gte: dayStart, lt: dayEnd },
        },
      });

      const sh1 = row.StartHour1;
      const sm1 = row.StartMinute1;
      const eh1 = row.EndHour1;
      const em1 = row.EndMinute1;
      const block1Empty =
        isBlank(sh1) || isBlank(sm1) || isBlank(eh1) || isBlank(em1);

      const sh2 = row.StartHour2;
      const sm2 = row.StartMinute2;
      const eh2 = row.EndHour2;
      const em2 = row.EndMinute2;
      const block2Filled =
        !isBlank(sh2) && !isBlank(sm2) && !isBlank(eh2) && !isBlank(em2);

      if (existing) {
        if (block1Empty) {
          await prisma.workSchedules.delete({ where: { Id: existing.Id } });
          anyProcessed = true;
          continue;
        }
        const err1 = validateBlock(dayStr, String(sh1 ?? ""), String(sm1 ?? ""), String(eh1 ?? ""), String(em1 ?? ""));
        if (err1) {
          return NextResponse.json({ error: `${row.Day}: ${err1}` }, { status: 400 });
        }
        if (block2Filled) {
          const err2 = validateBlock(dayStr, String(sh2!), String(sm2!), String(eh2!), String(em2!));
          if (err2) {
            return NextResponse.json({ error: `${row.Day} (block 2): ${err2}` }, { status: 400 });
          }
          const end1 = new Date(`${dayStr}T${String(eh1).padStart(2, "0")}:${String(em1).padStart(2, "0")}:00.000Z`);
          const start2 = new Date(`${dayStr}T${String(sh2).padStart(2, "0")}:${String(sm2).padStart(2, "0")}:00.000Z`);
          if (start2 <= end1) {
            return NextResponse.json({ error: `${row.Day}: Second block start must be after first block end.` }, { status: 400 });
          }
        }
        const start1 = new Date(`${dayStr}T${String(sh1).padStart(2, "0")}:${String(sm1).padStart(2, "0")}:00.000Z`);
        const end1 = new Date(`${dayStr}T${String(eh1).padStart(2, "0")}:${String(em1).padStart(2, "0")}:00.000Z`);
        const start2 = block2Filled
          ? new Date(`${dayStr}T${String(sh2).padStart(2, "0")}:${String(sm2).padStart(2, "0")}:00.000Z`)
          : MIDNIGHT_SENTINEL;
        const end2 = block2Filled
          ? new Date(`${dayStr}T${String(eh2).padStart(2, "0")}:${String(em2).padStart(2, "0")}:00.000Z`)
          : MIDNIGHT_SENTINEL;
        await prisma.workSchedules.update({
          where: { Id: existing.Id },
          data: { Start: start1, End: end1, Start2: start2, End2: end2 },
        });
        anyProcessed = true;
      } else {
        if (block1Empty) continue;
        const err1 = validateBlock(dayStr, String(sh1 ?? ""), String(sm1 ?? ""), String(eh1 ?? ""), String(em1 ?? ""));
        if (err1) {
          return NextResponse.json({ error: `${row.Day}: ${err1}` }, { status: 400 });
        }
        if (block2Filled) {
          const err2 = validateBlock(dayStr, String(sh2!), String(sm2!), String(eh2!), String(em2!));
          if (err2) {
            return NextResponse.json({ error: `${row.Day} (block 2): ${err2}` }, { status: 400 });
          }
          const end1 = new Date(`${dayStr}T${String(eh1).padStart(2, "0")}:${String(em1).padStart(2, "0")}:00.000Z`);
          const start2 = new Date(`${dayStr}T${String(sh2).padStart(2, "0")}:${String(sm2).padStart(2, "0")}:00.000Z`);
          if (start2 <= end1) {
            return NextResponse.json({ error: `${row.Day}: Second block start must be after first block end.` }, { status: 400 });
          }
        }
        const start1 = new Date(`${dayStr}T${String(sh1).padStart(2, "0")}:${String(sm1).padStart(2, "0")}:00.000Z`);
        const end1 = new Date(`${dayStr}T${String(eh1).padStart(2, "0")}:${String(em1).padStart(2, "0")}:00.000Z`);
        const start2 = block2Filled
          ? new Date(`${dayStr}T${String(sh2).padStart(2, "0")}:${String(sm2).padStart(2, "0")}:00.000Z`)
          : MIDNIGHT_SENTINEL;
        const end2 = block2Filled
          ? new Date(`${dayStr}T${String(eh2).padStart(2, "0")}:${String(em2).padStart(2, "0")}:00.000Z`)
          : MIDNIGHT_SENTINEL;
        await prisma.workSchedules.create({
          data: {
            Id: randomUUID(),
            Start: start1,
            End: end1,
            Start2: start2,
            End2: end2,
            Intern_Id: internId,
          },
        });
        anyProcessed = true;
      }
    }

    return NextResponse.json(anyProcessed ? { valid: true } : { valid: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
