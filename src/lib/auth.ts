import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 14; // 14 days in seconds
export const REVALIDATE_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export interface SessionData {
  userId: string;
  userName: string;
  roles: string[];
  isLoggedIn: boolean;
  rememberMe?: boolean;
  lastValidatedAt?: number;
}

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "apc_session",
  cookieOptions: {
    ...baseCookieOptions,
    maxAge: undefined, // session cookie by default; createSession overrides when rememberMe
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

/** True when a user is logged in (Apply and similar public-only flows should be blocked). */
export function hasLoggedInUser(session: SessionData): boolean {
  return Boolean(session.isLoggedIn && session.userId);
}

export async function createSession(
  data: Omit<SessionData, "isLoggedIn" | "lastValidatedAt">,
  rememberMe: boolean
) {
  const session = await getSession();
  session.userId = data.userId;
  session.userName = data.userName;
  session.roles = data.roles;
  session.isLoggedIn = true;
  session.rememberMe = rememberMe;
  session.lastValidatedAt = Date.now();

  session.updateConfig({
    ...sessionOptions,
    cookieOptions: {
      ...baseCookieOptions,
      maxAge: rememberMe ? REMEMBER_ME_MAX_AGE : undefined,
    },
  });
  await session.save();
}

/** Call before session.save() when revalidating so the cookie keeps the right lifetime (14-day if rememberMe, else session). */
export function applySessionCookieConfig(
  session: SessionData & { updateConfig: (opts: SessionOptions) => void }
) {
  session.updateConfig({
    ...sessionOptions,
    cookieOptions: {
      ...baseCookieOptions,
      maxAge: session.rememberMe ? REMEMBER_ME_MAX_AGE : undefined,
    },
  });
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
