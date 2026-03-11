import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const EXPORT_ROLES = ["admin", "IT", "staff"];

async function requireExportAccess(): Promise<
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

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US");
}

function formatGradDate(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** GET: export all applicants as HTML table (.xls). Auth: admin, IT, staff. No filtering; no ValidEmp column. */
export async function GET() {
  try {
    const access = await requireExportAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.applicants.findMany({
      orderBy: { Id: "asc" },
    });

    const headers = [
      "Interview Comment",
      "Note",
      "Date Applied",
      "Last Name",
      "First Name",
      "City",
      "State",
      "School",
      "Level",
      "Grad Date",
      "Email",
      "Phone",
      "Major",
      "Minor",
      "Skills",
      "Foreign Language",
    ];

    const thead = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
    const trs = rows.map((a) => {
      const comment = escapeHtml(a.Comment);
      const note = escapeHtml(a.Note);
      const dateApplied = formatShortDate(a.DateApplied);
      const lastName = escapeHtml(a.LastName);
      const firstName = escapeHtml(a.FirstName);
      const city = escapeHtml(a.City);
      const state = escapeHtml(a.State);
      const school = escapeHtml(a.School);
      const level = escapeHtml(a.Level);
      const gradDate = formatGradDate(a.GradDate);
      const email = escapeHtml(a.Email);
      const phone = escapeHtml(a.Phone);
      const major = escapeHtml(a.Major);
      const minor = escapeHtml(a.Minor);
      const skills = escapeHtml(a.Skills);
      const foreignLanguage = escapeHtml(a.ForeignLanguage);
      return `<tr><td>${comment}</td><td>${note}</td><td>${dateApplied}</td><td>${lastName}</td><td>${firstName}</td><td>${city}</td><td>${state}</td><td>${school}</td><td>${level}</td><td>${gradDate}</td><td>${email}</td><td>${phone}</td><td>${major}</td><td>${minor}</td><td>${skills}</td><td>${foreignLanguage}</td></tr>`;
    });

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><table border="1"><thead><tr>${thead}</tr></thead><tbody>${trs.join("")}</tbody></table></body></html>`;

    const dateStr = formatShortDate(new Date()).replace(/\//g, "-");
    const filename = `ApplicantDetails-${dateStr}.xls`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "application/ms-excel",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
