/**
 * SQL Server datetime has no timezone. The legacy app and DB store times as "wall clock"
 * (e.g. 7:00 AM in the organization's local sense). The MSSQL driver often returns those
 * same numbers as UTC (e.g. 07:00 UTC). We must NOT convert to America/Chicago or we
 * get 1:00 AM instead of 7:00 AM. So we format using the date's UTC hour/minute as the
 * display time (treat as already "local").
 */
export function formatScheduleTime(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const am = h < 12;
  const hour = h % 12 || 12;
  const minute = m < 10 ? `0${m}` : String(m);
  return `${hour}:${minute} ${am ? "AM" : "PM"}`;
}

/** Same rule as old view (ScheduleDisplay.cshtml): show second block only when not "12:00 AM". */
const MIDNIGHT_DISPLAY = "12:00 AM";

export function isScheduleMidnight(d: Date): boolean {
  return formatScheduleTime(d) === MIDNIGHT_DISPLAY;
}
