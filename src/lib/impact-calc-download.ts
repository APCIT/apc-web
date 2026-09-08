import { NextResponse } from "next/server";
import { downloadImpactCalcBlob } from "@/lib/azure-storage";

const CONTENT_TYPES: Record<string, string> = {
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
  ".xls": "application/vnd.ms-excel",
};

/**
 * Reduces a name to characters that are safe in a Content-Disposition header.
 * Accents are decomposed and dropped rather than encoded, so "Núñez" becomes
 * "Nunez" instead of forcing the RFC 5987 form for a single character.
 */
function safeNamePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "");
}

function extensionOf(blobName: string): string {
  const dot = blobName.lastIndexOf(".");
  return dot === -1 ? "" : blobName.slice(dot).toLowerCase();
}

/**
 * Streams an intern's impact calculator back to the caller under a filename
 * staff can recognise. Blobs are stored under generated GUIDs, which is what
 * makes the raw container links unreadable.
 *
 * Callers must have already authorized the request.
 */
export async function respondWithImpactCalc({
  blobName,
  firstName,
  lastName,
}: {
  blobName: string;
  firstName: string;
  lastName: string;
}): Promise<NextResponse> {
  let file: Buffer;
  try {
    file = await downloadImpactCalcBlob(blobName);
  } catch (e) {
    console.error("[impact-calc-download]", e);
    return NextResponse.json(
      { error: "The impact calculator could not be retrieved from storage." },
      { status: 502 }
    );
  }

  const ext = extensionOf(blobName);
  const namePart = [lastName, firstName].map(safeNamePart).filter(Boolean).join("_");
  const filename = namePart
    ? `Impact_Calculator_${namePart}${ext}`
    : `Impact_Calculator${ext}`;

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(file.length),
      "Cache-Control": "private, no-store",
    },
  });
}
