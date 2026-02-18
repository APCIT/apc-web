import { BlobServiceClient } from "@azure/storage-blob";

const CONTAINER_PRESENTATIONS = "presentations";

/**
 * Upload a buffer to the presentations container with the given blob name.
 * Requires AZURE_STORAGE_CONNECTION_STRING in env.
 */
export async function uploadPresentationBlob(
  blobName: string,
  data: Buffer
): Promise<void> {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
  }
  const client = BlobServiceClient.fromConnectionString(conn);
  const container = client.getContainerClient(CONTAINER_PRESENTATIONS);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(data);
}
