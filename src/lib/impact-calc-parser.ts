import ExcelJS from "exceljs";

export type ImpactTotalsField =
  | "increasedSales"
  | "retainedSales"
  | "jobsCreated"
  | "numberJobsCreated"
  | "jobsRetained"
  | "numberJobsRetained"
  | "costAvoidanceGovtFines"
  | "timeCostReduction"
  | "investments"
  | "avoidedInvestments";

export type ParsedImpactTotals = Record<ImpactTotalsField, number | null>;

export type ImpactCalcParseResult =
  | { ok: true; values: ParsedImpactTotals; matchedLabels: number; hasAnyValue: boolean }
  | { ok: false; reason: string };

const SUMMARY_SHEET = "totalimpacts";

/** Fields the database stores as whole numbers rather than currency. */
const INTEGER_FIELDS = new Set<ImpactTotalsField>([
  "numberJobsCreated",
  "numberJobsRetained",
]);

/**
 * Column A labels in the calculator's "Total Impacts" sheet, normalized.
 * "#" becomes "number" before punctuation is stripped, otherwise
 * "# Jobs Created" and "Jobs Created" would collapse to the same key.
 */
const LABEL_TO_FIELD: Record<string, ImpactTotalsField> = {
  increasedsales: "increasedSales",
  retainedsales: "retainedSales",
  jobscreated: "jobsCreated",
  numberjobscreated: "numberJobsCreated",
  jobsretained: "jobsRetained",
  numberjobsretained: "numberJobsRetained",
  costavoidancegovtfines: "costAvoidanceGovtFines",
  costavoidancegovernmentfines: "costAvoidanceGovtFines",
  govtfines: "costAvoidanceGovtFines",
  timecostreduction: "timeCostReduction",
  investments: "investments",
  avoidedinvestments: "avoidedInvestments",
};

function normalize(raw: string): string {
  return raw
    .replace(/#/g, " number ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function emptyValues(): ParsedImpactTotals {
  return {
    increasedSales: null,
    retainedSales: null,
    jobsCreated: null,
    numberJobsCreated: null,
    jobsRetained: null,
    numberJobsRetained: null,
    costAvoidanceGovtFines: null,
    timeCostReduction: null,
    investments: null,
    avoidedInvestments: null,
  };
}

/**
 * Reads a cell as text. Deliberately avoids ExcelJS's `cell.text`, which
 * throws on merged cells whose master holds no value, and the summary sheet
 * uses merged cells for its headings.
 */
function toText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return "";

  if (typeof value === "object") {
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("text" in value) return String(value.text ?? "");
    if ("result" in value) return toText(value.result as ExcelJS.CellValue);
  }

  return "";
}

/**
 * The summary cells are formulas, so the number we want is the value Excel
 * cached when it last saved. Editors that skip caching (some browser-based
 * spreadsheet tools) leave no result, which reads as absent rather than zero.
 */
function toNumber(value: ExcelJS.CellValue): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const negated = /^\(.*\)$/.test(value.trim());
    const cleaned = value.replace(/[$,\s()]/g, "");
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    if (!Number.isFinite(parsed)) return null;
    return negated ? -parsed : parsed;
  }

  if (typeof value === "object") {
    if ("result" in value) return toNumber(value.result as ExcelJS.CellValue);
    if ("richText" in value) {
      return toNumber(value.richText.map((part) => part.text).join(""));
    }
  }

  return null;
}

/**
 * Reads the ten summary figures from an uploaded impact calculator.
 *
 * Never throws: interns upload arbitrary files, and a failed read must not
 * block the upload itself, which is the artifact staff actually require.
 */
export async function parseImpactCalculator(
  file: Buffer
): Promise<ImpactCalcParseResult> {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(file as unknown as ArrayBuffer);
  } catch {
    return { ok: false, reason: "The file could not be read as an Excel workbook." };
  }

  const sheet = workbook.worksheets.find((ws) => normalize(ws.name) === SUMMARY_SHEET);
  if (!sheet) {
    return {
      ok: false,
      reason: 'The workbook has no "Total Impacts" sheet.',
    };
  }

  const values = emptyValues();
  const seen = new Set<ImpactTotalsField>();

  try {
    sheet.eachRow((row) => {
      const label = toText(row.getCell(1).value).trim();
      if (!label) return;

      const field = LABEL_TO_FIELD[normalize(label)];
      if (!field || seen.has(field)) return;

      const parsed = toNumber(row.getCell(2).value);
      seen.add(field);
      values[field] =
        parsed !== null && INTEGER_FIELDS.has(field) ? Math.round(parsed) : parsed;
    });
  } catch {
    return { ok: false, reason: 'The "Total Impacts" sheet could not be read.' };
  }

  if (seen.size === 0) {
    return {
      ok: false,
      reason: 'No recognizable totals were found on the "Total Impacts" sheet.',
    };
  }

  return {
    ok: true,
    values,
    matchedLabels: seen.size,
    hasAnyValue: Object.values(values).some((v) => v !== null && v !== 0),
  };
}
