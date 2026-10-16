import { prisma } from "@/lib/prisma";
import { formatScheduleTime } from "@/lib/schedule-time";
import { sendMail } from "@/lib/mail";

/** Sunday 00:00 local — same week boundary as Interns list / period hours. */
export function startOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Previous completed 2-week pay cycle (pay lag).
 * Current cycle = last week + this week; payday pays the cycle before that.
 */
export function getPreviousPayPeriod(now = new Date()): {
  periodStart: Date;
  periodEnd: Date;
} {
  const weekStart = startOfWeek(now);
  const periodEnd = new Date(weekStart);
  periodEnd.setDate(periodEnd.getDate() - 7);
  const periodStart = new Date(weekStart);
  periodStart.setDate(periodStart.getDate() - 21);
  return { periodStart, periodEnd };
}

export function formatPeriodLabel(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  // periodEnd is exclusive (start of week after period); show last included day
  const lastDay = new Date(end);
  lastDay.setDate(lastDay.getDate() - 1);
  return `${fmt(start)} - ${fmt(lastDay)}`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const m = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const y = date.getUTCFullYear();
  return `${m}/${day}/${y}`;
}

const CLIENT_HEADERS = [
  "Last Name",
  "First Name",
  "Date",
  "Start",
  "End",
  "Lunch",
  "Duration",
  "Company",
  "Description",
];

export type ClientTimelogXls = {
  html: string;
  filename: string;
  rowCount: number;
};

/** Client-safe Excel HTML (no CWID) for intern Ids in [periodStart, periodEnd). */
export async function buildClientTimelogXls(options: {
  internIds: string[];
  periodStart: Date;
  periodEnd: Date;
}): Promise<ClientTimelogXls> {
  const { internIds, periodStart, periodEnd } = options;
  if (internIds.length === 0) {
    return {
      html: emptyTable(),
      filename: filenameFor(periodStart, periodEnd),
      rowCount: 0,
    };
  }

  const timelogs = await prisma.timelogs.findMany({
    where: {
      Intern_Id: { in: internIds },
      Start: { gte: periodStart, lt: periodEnd },
    },
    include: {
      Interns: {
        include: {
          AspNetUsers: { include: { Companies: true } },
        },
      },
    },
  });

  type Row = (typeof timelogs)[0];
  const rows = timelogs
    .filter((t): t is Row & { Interns: NonNullable<Row["Interns"]> } => t.Interns != null)
    .map((t) => ({
      timelog: t,
      lastName: t.Interns.AspNetUsers?.LastName ?? "",
      firstName: t.Interns.AspNetUsers?.FirstName ?? "",
      company: t.Interns.AspNetUsers?.Companies?.Name ?? "",
    }));

  rows.sort((a, b) => {
    const c = a.lastName.localeCompare(b.lastName);
    if (c !== 0) return c;
    const d = a.firstName.localeCompare(b.firstName);
    if (d !== 0) return d;
    const aStart =
      a.timelog.Start instanceof Date
        ? a.timelog.Start.getTime()
        : new Date(a.timelog.Start).getTime();
    const bStart =
      b.timelog.Start instanceof Date
        ? b.timelog.Start.getTime()
        : new Date(b.timelog.Start).getTime();
    return aStart - bStart;
  });

  let tableRows =
    "<tr>" + CLIENT_HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";

  for (const r of rows) {
    const t = r.timelog;
    const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
    const end = t.End instanceof Date ? t.End : new Date(t.End);
    const lunch = t.Lunch ?? 0;
    const durationHours =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60) - lunch;
    const cells = [
      r.lastName,
      r.firstName,
      formatDate(start),
      formatScheduleTime(start),
      formatScheduleTime(end),
      String(lunch),
      durationHours.toFixed(2),
      r.company,
      t.Description ?? "",
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

  return {
    html,
    filename: filenameFor(periodStart, periodEnd),
    rowCount: rows.length,
  };
}

function emptyTable(): string {
  return [
    "<!DOCTYPE html>",
    '<html><head><meta charset="utf-8"/></head><body>',
    '<table border="1">',
    "<tr>" + CLIENT_HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>",
    "</table>",
    "</body></html>",
  ].join("");
}

function filenameFor(periodStart: Date, periodEnd: Date): string {
  const lastDay = new Date(periodEnd);
  lastDay.setDate(lastDay.getDate() - 1);
  const a = `${periodStart.getFullYear()}${String(periodStart.getMonth() + 1).padStart(2, "0")}${String(periodStart.getDate()).padStart(2, "0")}`;
  const b = `${lastDay.getFullYear()}${String(lastDay.getMonth() + 1).padStart(2, "0")}${String(lastDay.getDate()).padStart(2, "0")}`;
  return `Client-Timelogs-${a}-${b}.xls`;
}

export function parseInternIdsJson(raw: string | null | undefined): string[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return null;
  }
}

export async function resolveInternIdsForClient(options: {
  companyId: number;
  internIdsJson: string | null | undefined;
}): Promise<string[]> {
  const companyInterns = await prisma.interns.findMany({
    where: { AspNetUsers: { CompanyId: options.companyId } },
    select: { Id: true },
  });
  const companySet = new Set(companyInterns.map((i) => i.Id));
  const selected = parseInternIdsJson(options.internIdsJson);
  if (!selected || selected.length === 0) {
    return [...companySet];
  }
  return selected.filter((id) => companySet.has(id));
}

export type SendClientTimelogResult = {
  ok: boolean;
  clientUserId: string;
  recipientEmail: string;
  internCount: number;
  rowCount: number;
  error?: string;
};

/** End of calendar day for semester end date (local). */
export function endOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export async function getClientTimelogConfig(): Promise<{
  semesterLabel: string | null;
  semesterEnd: Date | null;
  semesterEnded: boolean;
}> {
  // After prisma generate, restart the Next server so this delegate exists.
  const delegate = (prisma as { clientTimelogConfig?: typeof prisma.clientTimelogConfig })
    .clientTimelogConfig;
  if (!delegate) {
    return { semesterLabel: null, semesterEnd: null, semesterEnded: false };
  }
  const row = await delegate.findUnique({ where: { Id: 1 } });
  const semesterEnd = row?.SemesterEnd ?? null;
  const semesterEnded =
    semesterEnd != null && Date.now() > endOfLocalDay(semesterEnd).getTime();
  return {
    semesterLabel: row?.SemesterLabel ?? null,
    semesterEnd,
    semesterEnded,
  };
}

export async function sendClientTimelogEmail(options: {
  clientUserId: string;
  sentByUserId: string | null;
  periodStart?: Date;
  periodEnd?: Date;
  /** If false, still builds/logs but skips inactive clients. Default true = respect Active flag. */
  requireActive?: boolean;
}): Promise<SendClientTimelogResult> {
  const { periodStart, periodEnd } = options.periodStart
    ? {
        periodStart: options.periodStart,
        periodEnd: options.periodEnd ?? getPreviousPayPeriod().periodEnd,
      }
    : getPreviousPayPeriod();

  const client = await prisma.aspNetUsers.findUnique({
    where: { Id: options.clientUserId },
    include: {
      Companies: true,
      AspNetUserRoles: { include: { AspNetRoles: true } },
    },
  });

  if (!client) {
    return {
      ok: false,
      clientUserId: options.clientUserId,
      recipientEmail: "",
      internCount: 0,
      rowCount: 0,
      error: "Client user not found",
    };
  }

  const isClient = client.AspNetUserRoles.some((ur) => ur.AspNetRoles.Name === "client");
  if (!isClient) {
    return {
      ok: false,
      clientUserId: options.clientUserId,
      recipientEmail: client.Email ?? "",
      internCount: 0,
      rowCount: 0,
      error: "User does not have the client role",
    };
  }

  const email = (client.Email ?? "").trim();
  if (!email) {
    return {
      ok: false,
      clientUserId: options.clientUserId,
      recipientEmail: "",
      internCount: 0,
      rowCount: 0,
      error: "Client has no email address",
    };
  }

  const settings = await prisma.clientTimelogSettings.findUnique({
    where: { ClientUserId: options.clientUserId },
  });

  if ((options.requireActive ?? true) && settings && !settings.Active) {
    return {
      ok: false,
      clientUserId: options.clientUserId,
      recipientEmail: email,
      internCount: 0,
      rowCount: 0,
      error: "Client timelog emails are disabled for this client",
    };
  }

  const internIds = await resolveInternIdsForClient({
    companyId: client.CompanyId,
    internIdsJson: settings?.InternIdsJson,
  });

  const selectedInterns =
    internIds.length === 0
      ? []
      : await prisma.interns.findMany({
          where: { Id: { in: internIds } },
          include: {
            AspNetUsers: { select: { FirstName: true, LastName: true } },
          },
        });
  const internNames = selectedInterns
    .map((i) => {
      const last = i.AspNetUsers?.LastName?.trim() ?? "";
      const first = i.AspNetUsers?.FirstName?.trim() ?? "";
      if (last && first) return `${last}, ${first}`;
      return last || first || "Unknown intern";
    })
    .sort((a, b) => a.localeCompare(b));

  const xls = await buildClientTimelogXls({
    internIds,
    periodStart,
    periodEnd,
  });

  const clientName = [client.FirstName, client.LastName].filter(Boolean).join(" ") || client.UserName;
  const companyName = client.Companies?.Name ?? null;
  const periodLabel = formatPeriodLabel(periodStart, periodEnd);

  const namesHtml =
    internNames.length === 0
      ? "the selected intern(s)"
      : internNames.length === 1
        ? `<strong>${escapeHtml(internNames[0])}</strong>`
        : internNames.map((n) => `<strong>${escapeHtml(n)}</strong>`).join(", ");

  const bodyHtml =
    xls.rowCount > 0
      ? `<p>Hello ${escapeHtml(clientName)},</p>
<p>Attached are the Alabama Productivity Center intern timelogs for <strong>${escapeHtml(periodLabel)}</strong>${companyName ? ` (${escapeHtml(companyName)})` : ""}.</p>
<p>${xls.rowCount} timelog row(s) · ${internIds.length} intern(s).</p>
<p>- Alabama Productivity Center</p>`
      : `<p>Hello ${escapeHtml(clientName)},</p>
<p>There was nothing reported for ${namesHtml} for the pay period <strong>${escapeHtml(periodLabel)}</strong>${companyName ? ` (${escapeHtml(companyName)})` : ""}.</p>
<p>No timelog entries were recorded for the selected intern(s) in that period.</p>
<p>- Alabama Productivity Center</p>`;

  try {
    await sendMail({
      to: email,
      subject:
        xls.rowCount > 0
          ? `APC Intern Timelogs ${periodLabel}`
          : `APC Intern Timelogs ${periodLabel} - nothing reported`,
      html: bodyHtml,
      attachments:
        xls.rowCount > 0
          ? [
              {
                filename: xls.filename,
                content: Buffer.from(xls.html, "utf8"),
                contentType: "application/vnd.ms-excel",
              },
            ]
          : undefined,
    });

    await prisma.clientTimelogSendLog.create({
      data: {
        ClientUserId: options.clientUserId,
        RecipientEmail: email,
        ClientName: clientName,
        CompanyName: companyName,
        PeriodStart: periodStart,
        PeriodEnd: periodEnd,
        InternCount: internIds.length,
        RowCount: xls.rowCount,
        Status: "sent",
        SentByUserId: options.sentByUserId,
      },
    });

    return {
      ok: true,
      clientUserId: options.clientUserId,
      recipientEmail: email,
      internCount: internIds.length,
      rowCount: xls.rowCount,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed";
    await prisma.clientTimelogSendLog.create({
      data: {
        ClientUserId: options.clientUserId,
        RecipientEmail: email,
        ClientName: clientName,
        CompanyName: companyName,
        PeriodStart: periodStart,
        PeriodEnd: periodEnd,
        InternCount: internIds.length,
        RowCount: xls.rowCount,
        Status: "failed",
        ErrorMessage: msg,
        SentByUserId: options.sentByUserId,
      },
    });
    return {
      ok: false,
      clientUserId: options.clientUserId,
      recipientEmail: email,
      internCount: internIds.length,
      rowCount: xls.rowCount,
      error: msg,
    };
  }
}
