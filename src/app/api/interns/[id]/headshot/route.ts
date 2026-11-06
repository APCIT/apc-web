import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadHeadshotBlob } from "@/lib/azure-storage";
import { headshotContentType, validateUpload } from "@/lib/upload-validation";

/** Update Picture: admin, IT, staff only (same as Update Resume). */
const ROLES = ["admin", "IT", "staff"];

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true }
> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** POST: upload headshot for intern; set Intern.HeadshotId to new blob name.
 *  Accepts JSON: { headshotFileBase64, headshotFileName }. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const id = (await params).id;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await _request.json().catch(() => ({}));
    const fileBase64 =
      typeof body.headshotFileBase64 === "string" ? body.headshotFileBase64 : "";
    const fileName =
      typeof body.headshotFileName === "string" ? body.headshotFileName.trim() : "";

    if (!fileBase64 || !fileName) {
      return NextResponse.json({ error: "Please select a file to upload." }, { status: 400 });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(fileBase64, "base64");
    } catch {
      return NextResponse.json({ error: "Invalid file data." }, { status: 400 });
    }
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Please select a file to upload." }, { status: 400 });
    }

    const check = validateUpload({
      kind: "headshot",
      fileName,
      sizeBytes: buffer.length,
    });
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    if (
      !process.env.AZURE_STORAGE_CONNECTION_STRING ||
      process.env.AZURE_STORAGE_CONNECTION_STRING.includes("YOUR_ACCOUNT_KEY")
    ) {
      return NextResponse.json(
        {
          error:
            "Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING with a valid key.",
        },
        { status: 503 }
      );
    }

    const headshotId = `${crypto.randomUUID()}${check.ext}`;
    const contentType = headshotContentType(check.ext);

    const uploadTimeoutMs = 60_000;
    const uploadPromise = uploadHeadshotBlob(headshotId, buffer, contentType);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Storage upload timed out")), uploadTimeoutMs)
    );
    try {
      await Promise.race([uploadPromise, timeoutPromise]);
    } catch (blobErr) {
      const msg = blobErr instanceof Error ? blobErr.message : "Storage upload failed";
      return NextResponse.json(
        {
          error:
            msg === "Storage upload timed out"
              ? "Upload to storage timed out. Try again or check network."
              : `Storage upload failed: ${msg}`,
        },
        { status: 502 }
      );
    }

    await prisma.interns.update({
      where: { Id: id },
      data: { HeadshotId: headshotId },
    });

    return NextResponse.json({ ok: true, headshotId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
