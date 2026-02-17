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
  charts: `${base}/api/charts`,
  companies: `${base}/api/companies`,
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

/** Chart data: 2D array, first row = headers, rest = [label, number]. */
export type ChartData = (string | number)[][];

export type ChartsResponse = {
  pastInternsByMajorData: ChartData;
  internsByMajorData: ChartData;
  pastInternsByCompanyData: ChartData;
  internsByCompanyData: ChartData;
  pastHrsByCompanyData: ChartData;
  hrsByCompanyData: ChartData;
};

/** Call this to get all chart datasets (requires admin, IT, or staff). */
export async function GET_CHARTS_API(): Promise<
  | { ok: true; data: ChartsResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.charts, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load charts",
      status: res.status,
    };
  }
  return { ok: true, data: data as ChartsResponse };
}

/** Company list item (Name and Abbreviation from DB). */
export type CompanyItem = { id: number; name: string; abbreviation: string };

/** Call this to get the companies list, ordered by name. */
export async function GET_COMPANIES_API(): Promise<
  | { ok: true; companies: CompanyItem[] }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.companies, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load companies",
      status: res.status,
    };
  }
  return { ok: true, companies: data as CompanyItem[] };
}

/** Call this to get one company for the Edit form. */
export async function GET_COMPANY_API(id: number): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to create a company. */
export async function CREATE_COMPANY_API(body: {
  name: string;
  abbreviation: string;
}): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.companies, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to create company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to update a company. */
export async function UPDATE_COMPANY_API(
  id: number,
  body: { name: string; abbreviation: string }
): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, {
    ...defaultFetchOptions,
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to delete a company. */
export async function DELETE_COMPANY_API(id: number): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, {
    ...defaultFetchOptions,
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete company",
      status: res.status,
    };
  }
  return { ok: true };
}
