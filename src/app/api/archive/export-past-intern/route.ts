import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Export ATN Report: admin, IT, staff only (reception cannot run it). */
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Semester date → "Fall yyyy" / "Spring yyyy" / "Summer yyyy". */
function semesterToLabel(d: Date): string {
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  if (month === 11) return `Fall ${year}`;
  return `Semester ${year}`;
}

/** Grad date → "MMM yyyy" (e.g. "May 2024"). */
function formatGradDate(d: Date): string {
  const m = MONTHS[d.getUTCMonth()];
  const y = d.getUTCFullYear();
  return `${m} ${y}`;
}

/** Column headers for Export ATN Report (26 columns in order). */
const HEADERS = [
  "Semester",
  "Company",
  "Wage",
  "Hours Worked",
  "No. of Workforce Trained",
  "CWID",
  "Mentor",
  "Mentor Title",
  "Mentor Phone Number",
  "Mentor Email",
  "Last Name",
  "First Name",
  "Email",
  "Phone Number",
  "Hometown",
  "Address",
  "How did you hear about us?",
  "Level",
  "Grad Date",
  "Major",
  "Minor",
  "University",
  "Fund",
  "APC Project Manager(s)",
  "Alabama County",
  "Note",
];

/** GET: Export ATN Report for one semester. Query: thisSemester=yyyy-MM-dd. Auth: admin, IT, staff. Sorted by LastName asc. */
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
      orderBy: { LastName: "asc" },
    });

    let tableRows = "<tr>" + HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const r of rows) {
      const semesterLabel = semesterToLabel(r.Semester);
      const cells = [
        semesterLabel,
        r.Company ?? "",
        String(r.Wage),
        String(r.HrsWorked),
        "", // No. of Workforce Trained - empty
        r.CWID ?? "",
        r.MentorName ?? "",
        r.MentorTitle ?? "",
        r.MentorPhone ?? "",
        r.MentorEmail ?? "",
        r.LastName ?? "",
        r.FirstName ?? "",
        r.Email ?? "",
        r.Phone ?? "",
        (r as { Hometown?: string | null }).Hometown ?? "",
        r.Street ?? "", // Address = Street only
        (r as { HearAboutUs?: string | null }).HearAboutUs ?? "",
        (r as { Level?: string | null }).Level ?? "",
        formatGradDate(r.GradDate),
        r.Major ?? "",
        "", // Minor - empty (past interns don't track minor)
        r.School ?? "", // University
        "", // Fund - empty
        "", // APC Project Manager(s) - empty
        "", // Alabama County - empty
        r.Note ?? "",
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
    const filename = `InternDetails-${dateStr}.xls`;

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
