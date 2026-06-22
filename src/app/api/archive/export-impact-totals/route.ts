import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const EXPORT_ROLES = ["IT", "admin", "staff", "reception"];

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export async function GET() {
  try {
    const access = await requireExportAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.interns.findMany({
      orderBy: {
        AspNetUsers: {
          LastName: "asc",
        },
      },
      select: {
        Id: true,
        AspNetUsers: {
          select: {
            FirstName: true,
            LastName: true,
            Companies: {
              select: {
                Name: true,
                Abbreviation: true,
              },
            },
          },
        },
        ImpactTotals: {
          select: {
            IncreasedSales: true,
            RetainedSales: true,
            JobsCreated: true,
            NumberJobsCreated: true,
            JobsRetained: true,
            NumberJobsRetained: true,
            CostAvoidanceGovtFines: true,
            TimeCostReduction: true,
            Investments: true,
            AvoidedInvestments: true,
            UpdatedAt: true,
          },
        },
      },
    });

    const headers = [
      "First Name",
      "Last Name",
      "Company",
      "Increased Sales",
      "Retained Sales",
      "Jobs Created",
      "# Jobs Created",
      "Jobs Retained",
      "# Jobs Retained",
      "Cost Avoidance - Gov't Fines",
      "Time Cost Reduction",
      "Investments",
      "Avoided Investments",
      "Last Updated",
    ];

    let tableRows =
      "<tr>" + headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

    for (const row of rows) {
      const totals = row.ImpactTotals;

      const cells = [
        row.AspNetUsers?.FirstName ?? "",
        row.AspNetUsers?.LastName ?? "",
        row.AspNetUsers?.Companies?.Abbreviation ?? row.AspNetUsers?.Companies?.Name ?? "",
        formatValue(totals?.IncreasedSales),
        formatValue(totals?.RetainedSales),
        formatValue(totals?.JobsCreated),
        formatValue(totals?.NumberJobsCreated),
        formatValue(totals?.JobsRetained),
        formatValue(totals?.NumberJobsRetained),
        formatValue(totals?.CostAvoidanceGovtFines),
        formatValue(totals?.TimeCostReduction),
        formatValue(totals?.Investments),
        formatValue(totals?.AvoidedInvestments),
        totals?.UpdatedAt ? totals.UpdatedAt.toLocaleDateString() : "",
      ];

      tableRows +=
        "<tr>" + cells.map((c) => `<td>${escapeHtml(String(c))}</td>`).join("") + "</tr>";
    }

    const html = [
      "<!DOCTYPE html>",
      '<html><head><meta charset="utf-8"/></head><body>',
      '<table border="1">',
      tableRows,
      "</table>",
      "</body></html>",
    ].join("");

    const now = new Date();
    const dateStr = `${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCFullYear()}`;
    const filename = `Impact_Totals_${dateStr}.xls`;

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