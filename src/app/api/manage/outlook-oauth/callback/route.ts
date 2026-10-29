import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exchangeAuthorizationCode, verifyOauthState } from "@/lib/outlook-oauth";

const ALLOWED = ["IT", "admin"];

/** GET: OAuth redirect from Microsoft. Stores refresh token, then returns to Manage page. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDesc = url.searchParams.get("error_description");

  // Prefer public URL. On Azure App Service, request.url host is the container
  // (e.g. abc123:8080), so fall back to x-forwarded-host / WEBSITE_HOSTNAME.
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const websiteHost = process.env.WEBSITE_HOSTNAME?.trim();
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : null) ||
    (websiteHost ? `https://${websiteHost}` : null) ||
    `${url.protocol}//${url.host}`;
  const doneUrl = new URL("/Manage/OutlookMail", base);

  const clearStateAndRedirect = () => {
    const res = NextResponse.redirect(doneUrl);
    res.cookies.set("outlook_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  };

  if (oauthError) {
    doneUrl.searchParams.set("error", oauthErrorDesc || oauthError);
    return clearStateAndRedirect();
  }

  // Must still be the IT/admin who started Connect (same session cookie).
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    doneUrl.searchParams.set(
      "error",
      "Your session expired during Outlook sign-in. Log in and try connecting again."
    );
    return clearStateAndRedirect();
  }

  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    doneUrl.searchParams.set("error", "Only IT or admin can connect Outlook mail.");
    return clearStateAndRedirect();
  }

  const cookieStore = await cookies();
  const cookieState = cookieStore.get("outlook_oauth_state")?.value;
  const statePayload =
    code && state && cookieState && state === cookieState
      ? verifyOauthState(state)
      : null;

  if (!code || !statePayload || statePayload.userId !== session.userId) {
    doneUrl.searchParams.set(
      "error",
      "Invalid or expired OAuth state. Try connecting again."
    );
    return clearStateAndRedirect();
  }

  try {
    const store = await exchangeAuthorizationCode(code);
    doneUrl.searchParams.set("connected", "1");
    if (store.accountEmail) {
      doneUrl.searchParams.set("email", store.accountEmail);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to connect Outlook";
    console.error("[outlook-oauth/callback]", e);
    doneUrl.searchParams.set("error", msg);
  }

  return clearStateAndRedirect();
}
