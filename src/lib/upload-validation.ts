/**
 * Server-side upload rules that match what the UI already allows.
 * Legitimate employee/applicant uploads keep working; junk types get a clear 400.
 */

export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const IMPACT_CALC_EXTENSIONS = [".xlsx", ".xls", ".xlsm"] as const;
export const PRESENTATION_EXTENSIONS = [".pptx", ".ppt", ".pdf", ".pub"] as const;

/** Generous caps so normal resumes / Excel / PPTX are unaffected. */
export const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_IMPACT_CALC_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_PRESENTATION_BYTES = 25 * 1024 * 1024; // 25 MB

export type UploadKind = "resume" | "impactCalc" | "presentation";

const KIND_CONFIG: Record<
  UploadKind,
  { extensions: readonly string[]; maxBytes: number; label: string }
> = {
  resume: {
    extensions: RESUME_EXTENSIONS,
    maxBytes: MAX_RESUME_BYTES,
    label: "PDF or Word document (.pdf, .doc, .docx)",
  },
  impactCalc: {
    extensions: IMPACT_CALC_EXTENSIONS,
    maxBytes: MAX_IMPACT_CALC_BYTES,
    label: "Excel file (.xlsx, .xls, .xlsm)",
  },
  presentation: {
    extensions: PRESENTATION_EXTENSIONS,
    maxBytes: MAX_PRESENTATION_BYTES,
    label: "PowerPoint, PDF, or Publisher file (.pptx, .ppt, .pdf, .pub)",
  },
};

/** Normalized lowercase extension including the dot, or "" if none. */
export function fileExtension(fileName: string): string {
  const base = fileName.split(/[/\\]/).pop() ?? fileName;
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return "";
  return base.slice(dot).toLowerCase();
}

export type UploadValidationOk = { ok: true; ext: string };
export type UploadValidationErr = { ok: false; error: string };
export type UploadValidationResult = UploadValidationOk | UploadValidationErr;

/**
 * Validate original file name + byte size for an upload kind.
 * Returns a safe lowercase extension to append to the stored blob UUID.
 */
export function validateUpload({
  kind,
  fileName,
  sizeBytes,
}: {
  kind: UploadKind;
  fileName: string;
  sizeBytes: number;
}): UploadValidationResult {
  const config = KIND_CONFIG[kind];
  const name = (fileName ?? "").trim();
  if (!name) {
    return { ok: false, error: "Please select a file to upload." };
  }
  if (name.includes("..") || name.includes("\0")) {
    return { ok: false, error: "Invalid file name." };
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return { ok: false, error: "Please select a file to upload." };
  }
  if (sizeBytes > config.maxBytes) {
    const mb = Math.round(config.maxBytes / (1024 * 1024));
    return {
      ok: false,
      error: `File is too large. Maximum size is ${mb} MB.`,
    };
  }
  const ext = fileExtension(name);
  if (!ext || !(config.extensions as readonly string[]).includes(ext)) {
    return {
      ok: false,
      error: `Unsupported file type. Please upload a ${config.label}.`,
    };
  }
  return { ok: true, ext };
}
