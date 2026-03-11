import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Export ATN Report: current intern roster. admin, IT, staff only. */
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

/** Semester (Intern.Semester month 11=Fall, 4=Spring, 7=Summer) → "Fall yyyy" etc. */
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

/** ATN Report columns (legacy ExportInternDetails). */
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

/** GET: Export ATN Report – current interns as Excel. Auth: admin, IT, staff. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const interns = await prisma.interns.findMany({
      include: {
        AspNetUsers: { include: { Companies: true } },
      },
    });
    interns.sort((a, b) => {
      const la = a.AspNetUsers?.LastName ?? "";
      const lb = b.AspNetUsers?.LastName ?? "";
      const c = la.localeCompare(lb);
      if (c !== 0) return c;
      const fa = a.AspNetUsers?.FirstName ?? "";
      const fb = b.AspNetUsers?.FirstName ?? "";
      return fa.localeCompare(fb);
    });

    let tableRows = "<tr>" + HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const i of interns) {
      const semesterLabel = semesterToLabel(i.Semester);
      const companyName = i.AspNetUsers?.Companies?.Name ?? "";
      const cells = [
        semesterLabel,
        companyName,
        "", // No. of Workforce Trained – blank
        i.AspNetUsers?.LastName ?? "",
        i.AspNetUsers?.FirstName ?? "",
        i.Level ?? "",
        formatGradDate(i.GradDate),
        i.Major ?? "",
        i.Minor ?? "",
        i.School ?? "", // University
        "", // Fund – blank
        "", // APC Project Manager(s) – blank
        "", // Alabama County – blank
        i.AspNetUsers?.Email ?? "",
        i.Phone ?? "",
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
    const filename = `PastInternDetails-${dateStr}.xls`;

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
