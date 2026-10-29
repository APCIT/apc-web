import { NextResponse } from "next/server";
import {
  isAllowedDownloadContainer,
  assertSafeBlobName,
} from "@/lib/azure-storage";
import { isPublicMarketingBlob } from "@/lib/public-files";
import { respondWithBlobFile } from "@/lib/blob-response";

/**
 * GET /api/public-files/[container]/[...blob]
 * Unauthenticated downloads for a fixed allowlist of marketing PDFs only.
 */
export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ container: string; blob: string[] }> }
) {
  try {
    const { container: rawContainer, blob: blobParts } = await params;
    const container = decodeURIComponent(rawContainer ?? "");
    const blobName = (blobParts ?? [])
      .map((p) => decodeURIComponent(p))
      .join("/");

    if (!isAllowedDownloadContainer(container)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
      assertSafeBlobName(blobName);
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isPublicMarketingBlob(container, blobName)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const asAttachment = url.searchParams.get("download") === "1";

    return respondWithBlobFile({
      container,
      blobName,
      disposition: asAttachment ? "attachment" : "inline",
    });
  } catch (e) {
    console.error("[api/public-files]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
