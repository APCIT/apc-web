import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isAllowedDownloadContainer,
  assertSafeBlobName,
} from "@/lib/azure-storage";
import { respondWithBlobFile } from "@/lib/blob-response";

/** Handout containers linked from Manage / To-Do List — any logged-in user. */
const ANY_AUTH_CONTAINERS = new Set([
  "staff-only-materials",
  "handbook",
  "communication-timemangement",
  "intern-reports",
]);

/** Resumes: roles that can open Applicants or Interns, plus interns (own resume UI). */
const RESUME_ROLES = [
  "IT",
  "admin",
  "staff",
  "reception",
  "accountant",
  "intern",
];

/** Presentations library roles (match Presentations page). */
const PRESENTATION_ROLES = ["IT", "admin", "staff", "advisor", "reception"];

/** Checklist uploads — staff or the intern (opaque UUID). */
const CHECKLIST_ROLES = ["IT", "admin", "staff", "reception", "intern"];

async function requireAccess(
  container: string
): Promise<{ error: NextResponse } | { ok: true; roles: string[] }> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);

  if (ANY_AUTH_CONTAINERS.has(container)) {
    return { ok: true, roles };
  }

  let allowed: string[];
  if (container === "resumes") {
    allowed = RESUME_ROLES;
  } else if (container === "presentations") {
    allowed = PRESENTATION_ROLES;
  } else if (
    container === "checklist-impactcalculator" ||
    container === "checklist-presentation"
  ) {
    allowed = CHECKLIST_ROLES;
  } else {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (!allowed.some((r) => roles.includes(r))) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, roles };
}

/**
 * GET /api/files/[container]/[...blob]
 * Authenticated proxy for private Azure blobs. Replaces direct blob.core.windows.net links.
 */
export async function GET(
  _request: Request,
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

    const access = await requireAccess(container);
    if ("error" in access) return access.error;

    return respondWithBlobFile({
      container,
      blobName,
      disposition: "inline",
    });
  } catch (e) {
    console.error("[api/files]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
