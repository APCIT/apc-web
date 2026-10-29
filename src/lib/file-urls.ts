/**
 * Build an authenticated app URL that streams a private Azure blob.
 * Path segments are encoded so spaces and special characters stay intact.
 */
export function fileUrl(container: string, blobName: string): string {
  const encodedBlob = blobName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/api/files/${encodeURIComponent(container)}/${encodedBlob}`;
}

/**
 * Build a public (no-login) app URL for allowlisted marketing blobs only.
 */
export function publicFileUrl(container: string, blobName: string): string {
  const encodedBlob = blobName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/api/public-files/${encodeURIComponent(container)}/${encodedBlob}`;
}

/** Guess Content-Type from a blob / file name extension. */
export function contentTypeForBlobName(blobName: string): string {
  const dot = blobName.lastIndexOf(".");
  const ext = dot === -1 ? "" : blobName.slice(dot).toLowerCase();
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".pub": "application/vnd.ms-publisher",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
  };
  return map[ext] ?? "application/octet-stream";
}

/** Basename for Content-Disposition (strip path segments if any). */
export function blobDownloadFilename(blobName: string): string {
  const parts = blobName.split("/");
  return parts[parts.length - 1] || "download";
}
