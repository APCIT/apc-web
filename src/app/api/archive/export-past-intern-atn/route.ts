import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Past interns ATN export (same columns as current intern ATN). admin, IT, staff only. */
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

/** Semester date → "Fall yyyy" / "Spring yyyy" / "Summer yyyy". */
function semesterToLabel(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 11) return `Fall ${year}`;
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  return `Semester ${year}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatGradDate(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Same column order as GET /api/archive/export-intern-details (current interns ATN). */
const HEADERS = [
  "Semester",
  "Company",
  "No. of Workforce Trained",
  "Last Name",
  "First Name",
  "Level",
  "Grad Date",
  "Major",
  "Minor",
  "University",
  "Fund",
  "APC Project Manager(s)",
  "Alabama County",
  "Email",
  "Phone Number",
];

/** GET: Export ATN Report for past interns in one semester. Query: thisSemester=yyyy-MM-dd. Auth: admin, IT, staff. */
export async function GET(request: Request) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const { searchParams } = new URL(request.url);
    const thisSemesterStr = searchParams.get("thisSemester")?.trim();
    if (!thisSemesterStr) {
      return NextResponse.json({ error: "thisSemester is required (yyyy-MM-dd)" }, { status: 400 });
    }

    const semDate = new Date(thisSemesterStr + "T00:00:00.000Z");
    if (Number.isNaN(semDate.getTime())) {
      return NextResponse.json({ error: "Invalid thisSemester date" }, { status: 400 });
    }

    const startOfDay = new Date(Date.UTC(semDate.getUTCFullYear(), semDate.getUTCMonth(), semDate.getUTCDate()));
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const rows = await prisma.pastInterns.findMany({
      where: {
        Semester: { gte: startOfDay, lt: endOfDay },
      },
      orderBy: [{ LastName: "asc" }, { FirstName: "asc" }],
    });

    let tableRows = "<tr>" + HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const r of rows) {
      const semesterLabel = semesterToLabel(r.Semester);
      const cells = [
        semesterLabel,
        r.Company ?? "",
        "", // No. of Workforce Trained — blank (matches current intern export)
        r.LastName ?? "",
        r.FirstName ?? "",
        r.Level ?? "",
        formatGradDate(r.GradDate),
        r.Major ?? "",
        r.Minor ?? "",
        r.School ?? "",
        "", // Fund — blank
        "", // APC Project Manager(s) — blank
        "", // Alabama County — blank
        r.Email ?? "",
        r.Phone ?? "",
      ];
      tableRows += "<tr>" + cells.map((c) => `<td>${escapeHtml(String(c))}</td>`).join("") + "</tr>";
    }

    const html = [
      "<!DOCTYPE html>",
      '<html><head><meta charset="utf-8"/></head><body>',
      "<table border=\"1\">",
      tableRows,
      "</table>",
      "</body></html>",
    ].join("");

    const filename = `PastInternsATN-${thisSemesterStr}.xls`;

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
