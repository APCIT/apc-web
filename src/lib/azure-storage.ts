import { BlobServiceClient } from "@azure/storage-blob";

const CONTAINER_PRESENTATIONS = "presentations";
const CONTAINER_RESUMES = "resumes";
const CONTAINER_IMPACT_CALC = "checklist-impactcalculator";
const CONTAINER_CHECKLIST_PRESENTATION = "checklist-presentation";

/** Containers the app may download from via connection string (after private access). */
export const ALLOWED_DOWNLOAD_CONTAINERS = [
  "resumes",
  "presentations",
  "checklist-impactcalculator",
  "checklist-presentation",
  "staff-only-materials",
  "handbook",
  "intern-reports",
  "communication-timemangement",
] as const;

export type AllowedDownloadContainer =
  (typeof ALLOWED_DOWNLOAD_CONTAINERS)[number];

function getClient(): BlobServiceClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
  }
  return BlobServiceClient.fromConnectionString(conn);
}

/**
 * Reject empty names, absolute paths, and traversal. Azure blob names may
 * contain spaces and most punctuation; only block path escape attempts.
 */
export function assertSafeBlobName(blobName: string): string {
  const name = blobName.trim();
  if (!name) {
    throw new Error("Blob name is required");
  }
  if (name.includes("..") || name.startsWith("/") || name.startsWith("\\")) {
    throw new Error("Invalid blob name");
  }
  if (name.includes("\0")) {
    throw new Error("Invalid blob name");
  }
  return name;
}

export function isAllowedDownloadContainer(
  container: string
): container is AllowedDownloadContainer {
  return (ALLOWED_DOWNLOAD_CONTAINERS as readonly string[]).includes(container);
}

/**
 * Download a blob from an allowlisted container using the account connection string.
 */
export async function downloadBlob(
  containerName: string,
  blobName: string
): Promise<Buffer> {
  if (!isAllowedDownloadContainer(containerName)) {
    throw new Error(`Container not allowed: ${containerName}`);
  }
  const safeName = assertSafeBlobName(blobName);
  const client = getClient();
  const container = client.getContainerClient(containerName);
  const blockBlob = container.getBlockBlobClient(safeName);
  return blockBlob.downloadToBuffer();
}

/**
 * Upload a buffer to the presentations container with the given blob name.
 * Requires AZURE_STORAGE_CONNECTION_STRING in env.
 */
export async function uploadPresentationBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const container = client.getContainerClient(CONTAINER_PRESENTATIONS);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}

/**
 * Upload a buffer to the resumes container with the given blob name.
 * Requires AZURE_STORAGE_CONNECTION_STRING in env.
 */
export async function uploadResumeBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const container = client.getContainerClient(CONTAINER_RESUMES);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}

export async function uploadImpactCalcBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const container = client.getContainerClient(CONTAINER_IMPACT_CALC);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}

export async function downloadImpactCalcBlob(blobName: string): Promise<Buffer> {
  return downloadBlob(CONTAINER_IMPACT_CALC, blobName);
}

export async function uploadChecklistPresentationBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const container = client.getContainerClient(CONTAINER_CHECKLIST_PRESENTATION);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}

export async function downloadChecklistPresentationBlob(
  blobName: string
): Promise<Buffer> {
  return downloadBlob(CONTAINER_CHECKLIST_PRESENTATION, blobName);
}
