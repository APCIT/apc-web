import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildAuthorizeUrl,
  createOauthState,
  isOutlookOauthConfigured,
} from "@/lib/outlook-oauth";

const ALLOWED = ["IT", "admin"];

async function requireAccess() {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const };
}

/** GET: redirect to Microsoft login to connect Outlook send. */
export async function GET() {
  const access = await requireAccess();
  if ("error" in access) return access.error;

  if (!isOutlookOauthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Outlook OAuth is not configured. Set MS_GRAPH_CLIENT_ID, MS_GRAPH_CLIENT_SECRET, and OUTLOOK_OAUTH_REDIRECT_URI.",
      },
      { status: 500 }
    );
  }

  const state = createOauthState();
  const res = NextResponse.redirect(buildAuthorizeUrl(state));
  res.cookies.set("outlook_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
  return res;
}
