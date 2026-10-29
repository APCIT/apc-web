/**
 * Exact blob names in staff-only-materials that remain publicly downloadable
 * through /api/public-files (marketing site). Everything else requires login.
 */
export const PUBLIC_MARKETING_BLOBS: ReadonlyArray<{
  container: string;
  blobName: string;
}> = [
  {
    container: "staff-only-materials",
    blobName: "APC Professional Services Catalog 2026.pdf",
  },
  {
    container: "staff-only-materials",
    blobName: "APC Fall 2025 Newsletter .pdf",
  },
  {
    container: "staff-only-materials",
    blobName: "APC Spring 2025 Newsletter.pdf",
  },
  {
    container: "staff-only-materials",
    blobName: "FY25 Impact Alabama - APC Annual Report.pdf",
  },
];

export function isPublicMarketingBlob(
  container: string,
  blobName: string
): boolean {
  return PUBLIC_MARKETING_BLOBS.some(
    (b) => b.container === container && b.blobName === blobName
  );
}
