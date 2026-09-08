import type { ImpactTotalsResponse } from "@/lib/api";

/** The ten figures as read out of an uploaded impact calculator. */
export type CalcValues = Record<keyof ImpactTotalsResponse, number | null>;

/**
 * True when a submitted figure is meaningfully different from the one in the
 * intern's calculator.
 *
 * A blank submission only counts as different when the calculator holds a real
 * figure, otherwise every untouched row on a mostly-empty workbook would be
 * flagged. The tolerance absorbs the rounding that comes from moving values
 * through form fields.
 */
export function differsFromCalc(
  submitted: string,
  calcValue: number | null
): boolean {
  if (calcValue === null) return false;

  const trimmed = submitted.trim();
  if (trimmed === "") return calcValue !== 0;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return true;

  return Math.abs(parsed - calcValue) > 0.005;
}
