import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Tara Timelogs export: admin, IT, staff only. */
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

/** Monday 00:00 UTC for the week containing date d. */
function weekStartMonday(d: Date): number {
  const date = new Date(d);
  const day = date.getUTCDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1; // days back to Monday
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}

/** Format week range as "MM/dd - MM/dd" (Mon–Sun). */
function weekLabel(weekStartTime: number): string {
  const mon = new Date(weekStartTime);
  const sun = new Date(mon);
  sun.setUTCDate(sun.getUTCDate() + 6);
  const m = (x: Date) => String(x.getUTCMonth() + 1).padStart(2, "0");
  const d = (x: Date) => String(x.getUTCDate()).padStart(2, "0");
  return `${m(mon)}/${d(mon)} - ${m(sun)}/${d(sun)}`;
}

/** GET: Export weekly hours pivot (Tara Timelogs). Auth: admin, IT, staff. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const timelogs = await prisma.timelogs.findMany({
      include: {
        Interns: {
          include: { AspNetUsers: true },
        },
      },
    });

    type T = (typeof timelogs)[0];
    const withIntern = timelogs.filter((t): t is T & { Interns: NonNullable<T["Interns"]> } => t.Interns != null);

    const weekSet = new Set<number>();
    for (const t of withIntern) {
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      weekSet.add(weekStartMonday(start));
    }
    const weekStarts = [...weekSet].sort((a, b) => a - b);

    const internMap = new Map<string, { lastName: string; firstName: string; hoursByWeek: Map<number, number> }>();
    for (const t of withIntern) {
      const id = t.Interns.Id;
      if (!internMap.has(id)) {
        internMap.set(id, {
          lastName: t.Interns.AspNetUsers?.LastName ?? "",
          firstName: t.Interns.AspNetUsers?.FirstName ?? "",
          hoursByWeek: new Map(),
        });
      }
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      const end = t.End instanceof Date ? t.End : new Date(t.End);
      const lunch = t.Lunch ?? 0;
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - lunch;
      const week = weekStartMonday(start);
      const rec = internMap.get(id)!;
      rec.hoursByWeek.set(week, (rec.hoursByWeek.get(week) ?? 0) + durationHours);
    }

    const internsOrdered = [...internMap.entries()].sort((a, b) => {
      const c = a[1].lastName.localeCompare(b[1].lastName);
      if (c !== 0) return c;
      return a[1].firstName.localeCompare(b[1].firstName);
    });

    const headers = ["First Name", "Last Name", ...weekStarts.map((w) => weekLabel(w))];
    let tableRows = "<tr>" + headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const [, rec] of internsOrdered) {
      const cells = [
        rec.firstName,
        rec.lastName,
        ...weekStarts.map((w) => (rec.hoursByWeek.get(w) ?? 0).toFixed(2)),
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
    const filename = `Timelog-all-weeks-${dateStr}.xls`;

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
