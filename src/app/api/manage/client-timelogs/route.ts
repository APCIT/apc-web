import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCumulativeRangeLabel,
  formatPeriodLabel,
  getClientTimelogConfig,
  getCumulativeRangeEnd,
  getLastCompletedSaturday,
  parseInternIdsJson,
  startOfLocalDay,
} from "@/lib/client-timelogs";

const ALLOWED = ["IT", "admin", "staff"];

async function requireAccess() {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, userId: session.userId };
}

/** GET: clients + settings + company interns + recent send log + cumulative date range. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const clientRole = await prisma.aspNetRoles.findFirst({
      where: { Name: "client" },
    });
    if (!clientRole) {
      return NextResponse.json({ error: "Client role not found" }, { status: 500 });
    }

    const clients = await prisma.aspNetUsers.findMany({
      where: { AspNetUserRoles: { some: { RoleId: clientRole.Id } } },
      include: { Companies: true },
      orderBy: [{ LastName: "asc" }, { FirstName: "asc" }],
    });

    const settings = await prisma.clientTimelogSettings.findMany();
    const settingsByUser = new Map(settings.map((s) => [s.ClientUserId, s]));

    const companyIds = [...new Set(clients.map((c) => c.CompanyId))];
    const interns = await prisma.interns.findMany({
      where: { AspNetUsers: { CompanyId: { in: companyIds } } },
      include: {
        AspNetUsers: { select: { FirstName: true, LastName: true, CompanyId: true } },
      },
      orderBy: { Id: "asc" },
    });

    const internsByCompany = new Map<
      number,
      { id: string; firstName: string; lastName: string }[]
    >();
    for (const intern of interns) {
      const companyId = intern.AspNetUsers?.CompanyId;
      if (companyId == null) continue;
      const list = internsByCompany.get(companyId) ?? [];
      list.push({
        id: intern.Id,
        firstName: intern.AspNetUsers?.FirstName ?? "",
        lastName: intern.AspNetUsers?.LastName ?? "",
      });
      internsByCompany.set(companyId, list);
    }

    for (const list of internsByCompany.values()) {
      list.sort((a, b) => {
        const c = a.lastName.localeCompare(b.lastName);
        return c !== 0 ? c : a.firstName.localeCompare(b.firstName);
      });
    }

    const asOf = new Date();
    const throughSaturday = getLastCompletedSaturday(asOf);
    const rangeEnd = getCumulativeRangeEnd(asOf);
    const config = await getClientTimelogConfig();

    const recentLogs = await prisma.clientTimelogSendLog.findMany({
      orderBy: { SentAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      period: {
        start: startOfLocalDay(throughSaturday).toISOString(),
        end: rangeEnd.toISOString(),
        throughSaturday: throughSaturday.toISOString(),
        label: formatCumulativeRangeLabel(asOf),
      },
      config: {
        semesterLabel: config.semesterLabel,
        semesterEnd: config.semesterEnd ? config.semesterEnd.toISOString().slice(0, 10) : null,
        semesterEnded: config.semesterEnded,
      },
      clients: clients.map((c) => {
        const s = settingsByUser.get(c.Id);
        const companyInterns = internsByCompany.get(c.CompanyId) ?? [];
        const selected = parseInternIdsJson(s?.InternIdsJson);
        return {
          id: c.Id,
          userName: c.UserName,
          firstName: c.FirstName,
          lastName: c.LastName,
          email: c.Email,
          companyId: c.CompanyId,
          companyName: c.Companies?.Name ?? null,
          active: s?.Active ?? true,
          /** null = all company interns */
          selectedInternIds: selected,
          interns: companyInterns,
        };
      }),
      logs: recentLogs.map((l) => ({
        id: l.Id,
        clientUserId: l.ClientUserId,
        recipientEmail: l.RecipientEmail,
        clientName: l.ClientName,
        companyName: l.CompanyName,
        periodStart: l.PeriodStart.toISOString(),
        periodEnd: l.PeriodEnd.toISOString(),
        periodLabel: formatPeriodLabel(l.PeriodStart, l.PeriodEnd),
        internCount: l.InternCount,
        rowCount: l.RowCount,
        status: l.Status,
        errorMessage: l.ErrorMessage,
        sentAt: l.SentAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[client-timelogs GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
