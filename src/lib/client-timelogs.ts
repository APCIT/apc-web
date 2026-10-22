import { prisma } from "@/lib/prisma";
import { formatScheduleTime } from "@/lib/schedule-time";
import { sendMail } from "@/lib/mail";

/** Org timezone for Monday auto-send day checks. */
export const CLIENT_TIMELOG_TZ = "America/Chicago";

export function startOfLocalDay(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Sunday 00:00 local — Sun–Sat week (same as Interns list). */
export function startOfWeekSunday(d: Date): Date {
  const result = startOfLocalDay(d);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

/**
 * Exclusive end for client emails: start of the current Sun–Sat week.
 * Includes entries through last Saturday (e.g. Mon Oct 19 → through Sat Oct 17).
 */
export function getCumulativeRangeEnd(now = new Date()): Date {
  return startOfWeekSunday(now);
}

/** Last Saturday included in the cumulative send (local midnight of that day). */
export function getLastCompletedSaturday(now = new Date()): Date {
  const weekStart = getCumulativeRangeEnd(now);
  const saturday = new Date(weekStart);
  saturday.setDate(saturday.getDate() - 1);
  return saturday;
}

/**
 * Internship start from Interns.Semester (same anchors as work-schedule):
 * April → mid Jan, July → mid May, November → mid Aug.
 */
export function getInternshipStartFromSemester(semester: Date): Date {
  const d = semester instanceof Date ? semester : new Date(semester);
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();
  let anchor: Date;
  if (month === 4) {
    anchor = new Date(year, 0, 15);
  } else if (month === 7) {
    anchor = new Date(year, 4, 15);
  } else if (month === 11) {
    anchor = new Date(year, 7, 15);
  } else {
    anchor = new Date(year, 0, 15);
  }
  return startOfLocalDay(anchor);
}

/** Label for [start, endExclusive). */
export function formatPeriodLabel(start: Date, endExclusive: Date): string {
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  const lastDay = new Date(endExclusive);
  lastDay.setDate(lastDay.getDate() - 1);
  return `${fmt(start)} - ${fmt(lastDay)}`;
}

export function formatCumulativeRangeLabel(asOf = new Date()): string {
  const sat = getLastCompletedSaturday(asOf);
  return `each intern's start through ${sat.getMonth() + 1}/${sat.getDate()}/${sat.getFullYear()} (last Saturday)`;
}

/** Weekday in America/Chicago: 0 = Sunday … 6 = Saturday. */
export function getWeekdayInOrgTz(now = new Date()): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: CLIENT_TIMELOG_TZ,
    weekday: "short",
  }).format(now);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? now.getDay();
}

export function isMondayInOrgTz(now = new Date()): boolean {
  return getWeekdayInOrgTz(now) === 1;
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

export type ClientTimelogXlsBuild = ClientTimelogXls & {
  /** Earliest internship start among selected interns (local). */
  rangeStart: Date;
  /** Exclusive end (current week Sunday) — through last Saturday. */
  rangeEnd: Date;
};

/**
 * Client-safe Excel HTML (no CWID): each intern from their semester start
 * through last Saturday relative to asOf (Sun–Sat weeks).
 */
export async function buildClientTimelogXls(options: {
  internIds: string[];
  asOf?: Date;
}): Promise<ClientTimelogXlsBuild> {
  const asOf = options.asOf ?? new Date();
  const rangeEnd = getCumulativeRangeEnd(asOf);
  const { internIds } = options;

  if (internIds.length === 0) {
    const rangeStart = startOfLocalDay(asOf);
    return {
      html: emptyTable(),
      filename: filenameFor(rangeStart, rangeEnd),
      rowCount: 0,
      rangeStart,
      rangeEnd,
    };
  }

  const interns = await prisma.interns.findMany({
    where: { Id: { in: internIds } },
    select: { Id: true, Semester: true },
  });
  const startByIntern = new Map<string, Date>(
    interns.map((i: { Id: string; Semester: Date }) => [
      i.Id,
      getInternshipStartFromSemester(i.Semester),
    ])
  );
  const starts = [...startByIntern.values()];
  const rangeStart =
    starts.length > 0
      ? new Date(Math.min(...starts.map((d: Date) => d.getTime())))
      : startOfLocalDay(asOf);

  const timelogs = await prisma.timelogs.findMany({
    where: {
      Intern_Id: { in: internIds },
      Start: { lt: rangeEnd },
    },
    include: {
      Interns: {
        include: {
          AspNetUsers: { include: { Companies: true } },
        },
      },
    },
  });

  type Row = (typeof timelogs)[number];
  type RowWithIntern = Row & { Interns: NonNullable<Row["Interns"]> };
  const rows = timelogs
    .filter((t: Row): t is RowWithIntern => {
      if (t.Interns == null || !t.Intern_Id) return false;
      const internStart = startByIntern.get(t.Intern_Id);
      if (!internStart) return false;
      const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
      return start.getTime() >= internStart.getTime();
    })
    .map((t: RowWithIntern) => ({
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
    filename: filenameFor(rangeStart, rangeEnd),
    rowCount: rows.length,
    rangeStart,
    rangeEnd,
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

function filenameFor(rangeStart: Date, rangeEndExclusive: Date): string {
  const lastDay = new Date(rangeEndExclusive);
  lastDay.setDate(lastDay.getDate() - 1);
  const a = `${rangeStart.getFullYear()}${String(rangeStart.getMonth() + 1).padStart(2, "0")}${String(rangeStart.getDate()).padStart(2, "0")}`;
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
  const companySet = new Set<string>(
    companyInterns.map((i: { Id: string }) => i.Id)
  );
  const selected = parseInternIdsJson(options.internIdsJson);
  if (!selected || selected.length === 0) {
    return Array.from(companySet);
  }
  return selected.filter((id: string) => companySet.has(id));
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
  /** As-of date; cutoff is last Saturday before this date's current week. */
  asOf?: Date;
  /** If false, still builds/logs but skips inactive clients. Default true = respect Active flag. */
  requireActive?: boolean;
}): Promise<SendClientTimelogResult> {
  const asOf = options.asOf ?? new Date();

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

  const isClient = client.AspNetUserRoles.some(
    (ur: { AspNetRoles: { Name: string | null } }) => ur.AspNetRoles.Name === "client"
  );
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
    .map(
      (i: {
        AspNetUsers: { FirstName: string | null; LastName: string | null } | null;
      }) => {
        const last = i.AspNetUsers?.LastName?.trim() ?? "";
        const first = i.AspNetUsers?.FirstName?.trim() ?? "";
        if (last && first) return `${last}, ${first}`;
        return last || first || "Unknown intern";
      }
    )
    .sort((a: string, b: string) => a.localeCompare(b));

  const xls = await buildClientTimelogXls({ internIds, asOf });
  const periodStart = xls.rangeStart;
  const periodEnd = xls.rangeEnd;

  const clientName = [client.FirstName, client.LastName].filter(Boolean).join(" ") || client.UserName;
  const companyName = client.Companies?.Name ?? null;

  const namesHtml =
    internNames.length === 0
      ? "the selected intern(s)"
      : internNames.length === 1
        ? `<strong>${escapeHtml(internNames[0])}</strong>`
        : internNames.map((n: string) => `<strong>${escapeHtml(n)}</strong>`).join(", ");

  const throughSat = getLastCompletedSaturday(asOf);
  const throughLabel = `${throughSat.getMonth() + 1}/${throughSat.getDate()}/${throughSat.getFullYear()}`;

  const bodyHtml =
    xls.rowCount > 0
      ? `<p>Hello ${escapeHtml(clientName)},</p>
<p>Attached are the Alabama Productivity Center intern timelogs from each intern's start date through <strong>${escapeHtml(throughLabel)}</strong>${companyName ? ` (${escapeHtml(companyName)})` : ""}.</p>
<p>${xls.rowCount} timelog row(s) · ${internIds.length} intern(s).</p>
<p>- Alabama Productivity Center</p>`
      : `<p>Hello ${escapeHtml(clientName)},</p>
<p>There was nothing reported for ${namesHtml} from internship start through <strong>${escapeHtml(throughLabel)}</strong>${companyName ? ` (${escapeHtml(companyName)})` : ""}.</p>
<p>No timelog entries were recorded for the selected intern(s) in that range.</p>
<p>- Alabama Productivity Center</p>`;

  try {
    await sendMail({
      to: email,
      subject:
        xls.rowCount > 0
          ? `APC Intern Timelogs through ${throughLabel}`
          : `APC Intern Timelogs - nothing reported through ${throughLabel}`,
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

/** Send cumulative timelogs to every active client (for bulk / Monday cron). */
export async function sendAllActiveClientTimelogEmails(options: {
  sentByUserId: string | null;
  asOf?: Date;
}): Promise<{
  sent: number;
  failed: number;
  results: SendClientTimelogResult[];
}> {
  const asOf = options.asOf ?? new Date();
  const clientRole = await prisma.aspNetRoles.findFirst({
    where: { Name: "client" },
  });
  if (!clientRole) {
    return { sent: 0, failed: 0, results: [] };
  }
  const clients = await prisma.aspNetUsers.findMany({
    where: { AspNetUserRoles: { some: { RoleId: clientRole.Id } } },
    select: { Id: true },
  });
  const results: SendClientTimelogResult[] = [];
  for (const c of clients) {
    results.push(
      await sendClientTimelogEmail({
        clientUserId: c.Id,
        sentByUserId: options.sentByUserId,
        asOf,
        requireActive: true,
      })
    );
  }
  return {
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
}
