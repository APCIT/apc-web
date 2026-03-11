import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatScheduleTime } from "@/lib/schedule-time";

/** Semester Timelogs export: admin, IT, staff only. */
const EXPORT_ROLES = ["admin", "IT", "staff"];

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
  if (!EXPORT_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const m = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const y = date.getUTCFullYear();
  return `${m}/${day}/${y}`;
}

const HEADERS = [
  "Last Name",
  "First Name",
  "CWID",
  "Date",
  "Start",
  "End",
  "Lunch",
  "Duration",
  "Company",
  "Description",
];

/** GET: Export all timelogs (Semester Timelogs). Auth: admin, IT, staff. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const timelogs = await prisma.timelogs.findMany({
      include: {
        Interns: {
          include: {
            AspNetUsers: { include: { Companies: true } },
          },
        },
      },
    });

    type Row = (typeof timelogs)[0];
    const rows = timelogs
      .filter((t): t is Row & { Interns: NonNullable<Row["Interns"]> } => t.Interns != null)
      .map((t) => ({
        timelog: t,
        lastName: t.Interns.AspNetUsers?.LastName ?? "",
        firstName: t.Interns.AspNetUsers?.FirstName ?? "",
        cwid: t.Interns.CWID ?? "",
        company: t.Interns.AspNetUsers?.Companies?.Name ?? "",
      }));
    rows.sort((a, b) => {
      const c = a.lastName.localeCompare(b.lastName);
      if (c !== 0) return c;
      const d = a.firstName.localeCompare(b.firstName);
      if (d !== 0) return d;
      const aStart = a.timelog.Start instanceof Date ? a.timelog.Start.getTime() : new Date(a.timelog.Start).getTime();
      const bStart = b.timelog.Start instanceof Date ? b.timelog.Start.getTime() : new Date(b.timelog.Start).getTime();
      return aStart - bStart;
    });

    let tableRows = "<tr>" + HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const r of rows) {
      const t = r.timelog;
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      const lunch = t.Lunch ?? 0;
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - lunch;
      const durationStr = durationHours.toFixed(2);

      const cells = [
        r.lastName,
        r.firstName,
        r.cwid,
        formatDate(start),
        formatScheduleTime(start),
        formatScheduleTime(end),
        String(lunch),
        durationStr,
        r.company,
        t.Description ?? "",
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
    const dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
    const filename = `Timelog-all-${dateStr}.xls`;

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
