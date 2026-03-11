import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Export Interns Without Reports: admin, IT, reception, staff only. */
const EXPORT_ROLES = ["admin", "IT", "reception", "staff"];

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

const HEADERS = ["Last Name", "First Name", "Impact Calculator", "Presentation"];

/** GET: Export all current interns with Impact Calculator / Presentation status. Auth: admin, IT, reception, staff. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const interns = await prisma.interns.findMany({
      include: { AspNetUsers: { include: { Companies: true } } },
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
      const hasImpact = i.ImpactCalcId != null && i.ImpactCalcId.trim() !== "";
      const hasPres = i.PresentationId != null && i.PresentationId.trim() !== "";
      const impactCell = hasImpact ? "COMPLETE" : " ";
      const presCell = hasPres ? "COMPLETE" : " ";
      const cells = [
        i.AspNetUsers?.LastName ?? "",
        i.AspNetUsers?.FirstName ?? "",
        impactCell,
        presCell,
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
    const filename = `Interns_Without_Reports_${dateStr}.xls`;

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
