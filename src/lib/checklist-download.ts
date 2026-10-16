import { NextResponse } from "next/server";

/**
 * Reduces a name to characters that are safe in a Content-Disposition header.
 * Accents are decomposed and dropped rather than encoded, so "Núñez" becomes
 * "Nunez" instead of forcing the RFC 5987 form for a single character.
 */
export function safeNamePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "");
}

/**
 * Intern.Semester / PastInterns.Semester: month 11 → Fall, 4 → Spring, 7 → Summer.
 * Returns underscore-separated tokens for filenames (e.g. "Fall_2025").
 */
export function semesterToFilenamePart(semester: Date | null | undefined): string {
  if (!semester) return "";
  const date = semester instanceof Date ? semester : new Date(semester);
  if (Number.isNaN(date.getTime())) return "";
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  let season = "";
  if (month === 11) season = "Fall";
  else if (month === 4) season = "Spring";
  else if (month === 7) season = "Summer";
  if (!season || !year) return "";
  return `${season}_${year}`;
}

export function extensionOf(blobName: string): string {
  const dot = blobName.lastIndexOf(".");
  return dot === -1 ? "" : blobName.slice(dot).toLowerCase();
}

/**
 * Builds filenames like Impact_Calculator_Smith_John_Fall_2025.xlsx.
 */
export function buildChecklistFilename({
  prefix,
  firstName,
  lastName,
  semester,
  ext,
}: {
  prefix: string;
  firstName: string;
  lastName: string;
  semester?: Date | null;
  ext: string;
}): string {
  const parts = [
    prefix,
    ...[lastName, firstName].map(safeNamePart).filter(Boolean),
  ];
  const semesterPart = semesterToFilenamePart(semester);
  if (semesterPart) parts.push(semesterPart);
  return `${parts.join("_")}${ext}`;
}

/**
 * Streams a checklist blob under a staff-readable filename.
 * Callers must have already authorized the request.
 */
export async function respondWithChecklistFile({
  download,
  blobName,
  prefix,
  firstName,
  lastName,
  semester,
  contentTypes,
  missingMessage,
}: {
  download: (blobName: string) => Promise<Buffer>;
  blobName: string;
  prefix: string;
  firstName: string;
  lastName: string;
  semester?: Date | null;
  contentTypes: Record<string, string>;
  missingMessage: string;
}): Promise<NextResponse> {
  let file: Buffer;
  try {
    file = await download(blobName);
  } catch (e) {
    console.error(`[${prefix}-download]`, e);
    return NextResponse.json({ error: missingMessage }, { status: 502 });
  }

  const ext = extensionOf(blobName);
  const filename = buildChecklistFilename({
    prefix,
    firstName,
    lastName,
    semester,
    ext,
  });

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(file.length),
      "Cache-Control": "private, no-store",
    },
  });
}
