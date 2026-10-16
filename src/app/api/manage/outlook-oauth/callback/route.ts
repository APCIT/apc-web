import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeAuthorizationCode, verifyOauthState } from "@/lib/outlook-oauth";

/** GET: OAuth redirect from Microsoft. Stores refresh token, then returns to Manage page. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDesc = url.searchParams.get("error_description");

  const base = process.env.NEXT_PUBLIC_APP_URL ?? `${url.protocol}//${url.host}`;
  const doneUrl = new URL("/Manage/OutlookMail", base);

  if (oauthError) {
    doneUrl.searchParams.set("error", oauthErrorDesc || oauthError);
    return NextResponse.redirect(doneUrl);
  }

  const cookieStore = await cookies();
  const cookieState = cookieStore.get("outlook_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState || !verifyOauthState(state)) {
    doneUrl.searchParams.set("error", "Invalid or expired OAuth state. Try connecting again.");
    return NextResponse.redirect(doneUrl);
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

  const res = NextResponse.redirect(doneUrl);
  res.cookies.set("outlook_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
