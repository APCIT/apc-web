import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatScheduleTime, isScheduleMidnight } from "@/lib/schedule-time";

/** Same roles as ScheduleDisplay: IT, admin, staff. */
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Monday–Friday = 1..5 */
const WEEKDAY_JS = [1, 2, 3, 4, 5];

/** GET: Export current intern work schedules (weekdays) as .xls. No query params. */
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
      return WEEKDAY_JS.includes(start.getDay());
    });

    /** Same order as work-schedules API and legacy app: Company → Start → End → LastName → FirstName. */
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

    const headers = ["Last Name", "First Name", "Company", "Day", "Start", "End", "Start2", "End2"];
    let tableRows = "<tr>" + headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const r of sorted) {
      const start = r.Start instanceof Date ? r.Start : new Date(r.Start);
      const start2 = r.Start2 instanceof Date ? r.Start2 : new Date(r.Start2);
      const end2 = r.End2 instanceof Date ? r.End2 : new Date(r.End2);
      const dayName = DAY_NAMES[start.getDay()] ?? "";
      const lastName = r.Interns?.AspNetUsers?.LastName ?? "";
      const firstName = r.Interns?.AspNetUsers?.FirstName ?? "";
      const company = r.Interns?.AspNetUsers?.Companies?.Name ?? "";
      const start2Str = isScheduleMidnight(start2) ? "" : formatScheduleTime(start2);
      const end2Str = isScheduleMidnight(end2) ? "" : formatScheduleTime(end2);
      const cells = [
        lastName,
        firstName,
        company,
        dayName,
        formatScheduleTime(start),
        formatScheduleTime(r.End instanceof Date ? r.End : new Date(r.End)),
        start2Str,
        end2Str,
      ];
      tableRows += "<tr>" + cells.map((c) => `<td>${escapeHtml(String(c))}</td>`).join("") + "</tr>";
    }

    const html = [
      "<!DOCTYPE html>",
      "<html><head><meta charset=\"utf-8\"/></head><body>",
      "<table border=\"1\">",
      tableRows,
      "</table>",
      "</body></html>",
    ].join("");

    const now = new Date();
    const dateStr = `${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCFullYear()}`;
    const filename = `SemesterSchedules-${dateStr}.xls`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
