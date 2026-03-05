import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatScheduleTime } from "@/lib/schedule-time";

/** Export intern timelog timesheet: admin, IT, staff, reception. */
const EXPORT_ROLES = ["admin", "IT", "staff", "reception"];

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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** DB stores wall-clock time (no TZ); driver returns as UTC. Format using UTC components so 4:00 AM stays 4:00 AM (see schedule-time.ts). */
function formatDate(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const m = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const y = date.getUTCFullYear();
  return `${m}/${day}/${y}`;
}

/** GET: Export timesheet for one intern (all timelogs). Query: id=<internId>. */
export async function GET(request: Request) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: {
        AspNetUsers: { include: { Companies: true } },
        Timelogs: true,
      },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const timelogs = [...(intern.Timelogs ?? [])].sort((a, b) => {
      const aStart = a.Start instanceof Date ? a.Start.getTime() : new Date(a.Start).getTime();
      const bStart = b.Start instanceof Date ? b.Start.getTime() : new Date(b.Start).getTime();
      return aStart - bStart;
    });

    const headers = [
      "Intern",
      "CWID",
      "Date",
      "Start",
      "End",
      "Lunch",
      "Company",
      "Description",
      "Hours",
      "Total Hours",
    ];

    let tableRows = "<tr>" + headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    let totalHours = 0;

    for (const t of timelogs) {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      const lunch = t.Lunch ?? 0;
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - lunch;
      totalHours += diffHours;

      const internName =
        [intern.AspNetUsers?.FirstName ?? "", intern.AspNetUsers?.LastName ?? ""]
          .map((x) => x.trim())
          .filter(Boolean)
          .join(" ") || "";

      const cells = [
        internName,
        intern.CWID ?? "",
        formatDate(start),
        formatScheduleTime(start),
        formatScheduleTime(end),
        String(lunch),
        intern.AspNetUsers?.Companies?.Name ?? "",
        t.Description ?? "",
        diffHours.toString(),
        totalHours.toString(),
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
    const dateStr = `${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}`;
    const username = intern.AspNetUsers?.UserName ?? "Intern";
    const filename = `Timelog-${username}-${dateStr}.xls`;

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

