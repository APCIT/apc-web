import { downloadImpactCalcBlob } from "@/lib/azure-storage";
import { respondWithChecklistFile } from "@/lib/checklist-download";
import type { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
  ".xls": "application/vnd.ms-excel",
};

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
  semester,
}: {
  blobName: string;
  firstName: string;
  lastName: string;
  semester?: Date | null;
}): Promise<NextResponse> {
  return respondWithChecklistFile({
    download: downloadImpactCalcBlob,
    blobName,
    prefix: "Impact_Calculator",
    firstName,
    lastName,
    semester,
    contentTypes: CONTENT_TYPES,
    missingMessage: "The impact calculator could not be retrieved from storage.",
  });
}
