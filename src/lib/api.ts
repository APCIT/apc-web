/**
 * Centralized API: paths and callable APIs.
 * Use LOGIN_API, GET_ME_API, LOGOUT_API in components instead of calling fetch directly.
 */
const base = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API = {
  auth: {
    login: `${base}/api/auth/login`,
    me: `${base}/api/auth/me`,
    logout: `${base}/api/auth/logout`,
  },
  interns: `${base}/api/interns`,
} as const;

const defaultFetchOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

/** Call this to log in. Returns { ok, user, roles } on success or { ok: false, error } on failure. */
export async function LOGIN_API(credentials: {
  username: string;
  password: string;
  rememberMe?: boolean;
}): Promise<
  | { ok: true; user: { id: string; userName: string; firstName: string | null; lastName: string | null }; roles: string[] }
  | { ok: false; error: string }
> {
  const res = await fetch(API.auth.login, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(credentials),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error =
      res.status === 401 ? "Invalid username or password." : (data?.error as string) ?? "An error occurred. Please try again.";
    return { ok: false, error };
  }
  return { ok: true, user: data.user, roles: data.roles };
}

/** Call this to get the current user (requires session cookie). */
export async function GET_ME_API(): Promise<
  | { ok: true; user: { id: string; userName: string; firstName: string | null; lastName: string | null; email: string | null }; roles: string[] }
  | { ok: false; error: string }
> {
  const res = await fetch(API.auth.me, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: (data?.error as string) ?? "Unauthorized" };
  return { ok: true, user: data.user, roles: data.roles };
}

/** Call this to log out. */
export async function LOGOUT_API(): Promise<{ ok: boolean }> {
  const res = await fetch(API.auth.logout, { ...defaultFetchOptions, method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && (data?.ok === true) };
}
