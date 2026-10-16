import { downloadChecklistPresentationBlob } from "@/lib/azure-storage";
import { respondWithChecklistFile } from "@/lib/checklist-download";
import type { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pdf": "application/pdf",
  ".pub": "application/vnd.ms-publisher",
};

/**
 * Streams an intern's presentation/poster under a staff-readable filename.
 * Callers must have already authorized the request.
 */
export async function respondWithPresentation({
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
    download: downloadChecklistPresentationBlob,
    blobName,
    prefix: "Presentation",
    firstName,
    lastName,
    semester,
    contentTypes: CONTENT_TYPES,
    missingMessage:
      "The presentation or poster could not be retrieved from storage.",
  });
}
