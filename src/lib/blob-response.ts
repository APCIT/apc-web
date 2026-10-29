import { NextResponse } from "next/server";
import { downloadBlob } from "@/lib/azure-storage";
import {
  blobDownloadFilename,
  contentTypeForBlobName,
} from "@/lib/file-urls";

/**
 * Stream an allowlisted blob to the client. disposition: inline (view) or attachment (download).
 */
export async function respondWithBlobFile({
  container,
  blobName,
  disposition = "inline",
}: {
  container: string;
  blobName: string;
  disposition?: "inline" | "attachment";
}): Promise<NextResponse> {
  let file: Buffer;
  try {
    file = await downloadBlob(container, blobName);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Download failed";
    if (
      msg.includes("not allowed") ||
      msg.includes("Invalid blob") ||
      msg.includes("required")
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Azure RestError for missing blob typically includes statusCode 404
    const status =
      typeof e === "object" &&
      e !== null &&
      "statusCode" in e &&
      (e as { statusCode?: number }).statusCode === 404
        ? 404
        : 502;
    console.error(`[blob-download] ${container}/${blobName}`, e);
    return NextResponse.json(
      {
        error:
          status === 404
            ? "File not found"
            : "Unable to retrieve file from storage",
      },
      { status }
    );
  }

  const filename = blobDownloadFilename(blobName);
  const safeFilename = filename.replace(/["\r\n]/g, "_");
  const contentType = contentTypeForBlobName(blobName);

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${disposition}; filename="${safeFilename}"`,
      "Content-Length": String(file.length),
      "Cache-Control": disposition === "inline" ? "private, max-age=300" : "private, no-store",
    },
  });
}
