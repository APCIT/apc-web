import { BlobServiceClient } from "@azure/storage-blob";

const CONTAINER_PRESENTATIONS = "presentations";
const CONTAINER_RESUMES = "resumes";
const CONTAINER_IMPACT_CALC = "checklist-impactcalculator";
const CONTAINER_CHECKLIST_PRESENTATION = "checklist-presentation";

function getClient(): BlobServiceClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
  }
  return BlobServiceClient.fromConnectionString(conn);
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

export async function uploadChecklistPresentationBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const container = client.getContainerClient(CONTAINER_CHECKLIST_PRESENTATION);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}
