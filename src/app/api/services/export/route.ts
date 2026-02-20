import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SERVICES_ROLES = ["IT", "admin", "staff", "reception"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function requireServicesAccess(): Promise<
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
  if (!SERVICES_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

function formatMonthYear(date: Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${year}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** GET: export all services as .xls (HTML table) for Excel. Ordered by EndDate then StartDate. */
export async function GET() {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.services.findMany({
      orderBy: [{ EndDate: "asc" }, { StartDate: "asc" }],
      select: {
        StaffMember: true,
        TypeOfService: true,
        County: true,
        FieldStaff: true,
        NumberEmployeesTrained: true,
        NumberInterns: true,
        Completed: true,
        Certificate: true,
        StartDate: true,
        EndDate: true,
        Companies: { select: { Name: true } },
      },
    });

    const headers = [
      "Staff Member",
      "Type of Service",
      "Company",
      "County",
      "Field Staff",
      "Employees Trained",
      "Interns Participating",
      "Completed",
      "Certificate Awarded",
      "Start Date",
      "End Date",
    ];

    let tableRows = "<tr>" + headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const s of rows) {
      const companyName = s.Companies?.Name ?? "";
      const completed = s.Completed ? "Yes" : "No";
      const certificate = s.Certificate ? "Yes" : "No";
      const cells = [
        s.StaffMember ?? "",
        s.TypeOfService ?? "",
        companyName,
        s.County ?? "",
        String(s.FieldStaff),
        String(s.NumberEmployeesTrained),
        String(s.NumberInterns),
        completed,
        certificate,
        formatMonthYear(s.StartDate),
        formatMonthYear(s.EndDate),
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
    const filename = `Services_ByEndDate_${dateStr}.xls`;

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
