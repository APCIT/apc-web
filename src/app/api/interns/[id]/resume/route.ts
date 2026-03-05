import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadResumeBlob } from "@/lib/azure-storage";

/** Update Resume: admin, IT, staff only (not reception). */
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

/** POST: upload resume file for intern; set Intern.ResumeId to new blob name.
 *  Accepts JSON: { resumeFileBase64, resumeFileName }. */
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
    const fileBase64 = typeof body.resumeFileBase64 === "string" ? body.resumeFileBase64 : "";
    const fileName = typeof body.resumeFileName === "string" ? body.resumeFileName.trim() : "";

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

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING.includes("YOUR_ACCOUNT_KEY")) {
      return NextResponse.json(
        { error: "Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING with a valid key." },
        { status: 503 }
      );
    }

    const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
    const resumeId = `${crypto.randomUUID()}${ext}`;

    const uploadTimeoutMs = 60_000;
    const uploadPromise = uploadResumeBlob(resumeId, buffer);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Storage upload timed out")), uploadTimeoutMs)
    );
    try {
      await Promise.race([uploadPromise, timeoutPromise]);
    } catch (blobErr) {
      const msg = blobErr instanceof Error ? blobErr.message : "Storage upload failed";
      return NextResponse.json(
        { error: msg === "Storage upload timed out" ? "Upload to storage timed out. Try again or check network." : `Storage upload failed: ${msg}` },
        { status: 502 }
      );
    }

    await prisma.interns.update({
      where: { Id: id },
      data: { ResumeId: resumeId },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
