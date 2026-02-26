/**
 * Helpers for the Interns table: birthday gift and dob display.
 * Legacy: show gift when today's day-of-year is in [Dob.DayOfYear - 4, Dob.DayOfYear] (5 days ending on birthday).
 */

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** True when today is in the 5-day window ending on the intern's birthday. Uses current year for day-of-year so leap year is consistent. */
export function isBirthdayWeek(dob: string | Date): boolean {
  const date = typeof dob === "string" ? new Date(dob) : dob;
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dobDay = getDayOfYear(thisYearBirthday);
  const todayDay = getDayOfYear(today);
  return todayDay >= dobDay - 4 && todayDay <= dobDay;
}

/** Format dob for birthday tooltip: "m" style (e.g. "1/15" or "12/31"). */
export function formatDobShort(dob: string | Date): string {
  const date = typeof dob === "string" ? new Date(dob) : dob;
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}/${day}`;
}
