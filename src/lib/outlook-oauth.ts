import { createHmac, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const TOKEN_DIR = path.join(process.cwd(), ".data");
const TOKEN_FILE = path.join(TOKEN_DIR, "outlook-oauth.json");

const DEFAULT_SCOPES = [
  "openid",
  "offline_access",
  "profile",
  "email",
  "https://graph.microsoft.com/User.Read",
  "https://graph.microsoft.com/Mail.Send",
].join(" ");

export type OutlookTokenStore = {
  refreshToken: string;
  accessToken?: string;
  expiresAt?: number;
  accountEmail?: string;
  updatedAt: string;
};

function getOauthConfig() {
  const clientId = process.env.MS_GRAPH_CLIENT_ID ?? "";
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET ?? "";
  const tenant = process.env.OUTLOOK_OAUTH_TENANT ?? "consumers";
  const redirectUri =
    process.env.OUTLOOK_OAUTH_REDIRECT_URI ??
    "http://localhost:3000/api/manage/outlook-oauth/callback";
  const senderEmail = process.env.OUTLOOK_SENDER_EMAIL ?? "apc-ua@outlook.com";
  return { clientId, clientSecret, tenant, redirectUri, senderEmail };
}

export function isOutlookOauthConfigured(): boolean {
  const { clientId, clientSecret, redirectUri } = getOauthConfig();
  return Boolean(clientId && clientSecret && redirectUri);
}

export function getOutlookSenderEmail(): string {
  return getOauthConfig().senderEmail;
}

function signState(payload: string): string {
  const secret = process.env.SESSION_SECRET ?? "apc-outlook-oauth-state";
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function createOauthState(): string {
  const payload = Buffer.from(
    JSON.stringify({ t: Date.now(), n: Math.random().toString(36).slice(2) })
  ).toString("base64url");
  return signState(payload);
}

export function verifyOauthState(state: string): boolean {
  const i = state.lastIndexOf(".");
  if (i <= 0) return false;
  const payload = state.slice(0, i);
  const sig = state.slice(i + 1);
  const expected = signState(payload).slice(payload.length + 1);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
    const raw = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      t?: number;
    };
    // 15 minutes
    return typeof raw.t === "number" && Date.now() - raw.t < 15 * 60 * 1000;
  } catch {
    return false;
  }
}

export function buildAuthorizeUrl(state: string): string {
  const { clientId, tenant, redirectUri } = getOauthConfig();
  const url = new URL(
    `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`
  );
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", DEFAULT_SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

async function readTokenFile(): Promise<OutlookTokenStore | null> {
  try {
    const raw = await fs.readFile(TOKEN_FILE, "utf8");
    return JSON.parse(raw) as OutlookTokenStore;
  } catch {
    return null;
  }
}

export async function saveTokenStore(store: OutlookTokenStore): Promise<void> {
  await fs.mkdir(TOKEN_DIR, { recursive: true });
  await fs.writeFile(TOKEN_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function clearTokenStore(): Promise<void> {
  try {
    await fs.unlink(TOKEN_FILE);
  } catch {
    // ignore
  }
}

export async function getStoredRefreshToken(): Promise<string | null> {
  const fromEnv = process.env.OUTLOOK_REFRESH_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const file = await readTokenFile();
  return file?.refreshToken ?? null;
}

export async function getOutlookConnectionStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  accountEmail: string | null;
  senderEmail: string;
}> {
  const file = await readTokenFile();
  const refresh = await getStoredRefreshToken();
  return {
    configured: isOutlookOauthConfigured(),
    connected: Boolean(refresh),
    accountEmail: file?.accountEmail ?? null,
    senderEmail: getOutlookSenderEmail(),
  };
}

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

async function requestToken(body: URLSearchParams): Promise<TokenResponse> {
  const { tenant } = getOauthConfig();
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );
  return (await res.json().catch(() => ({}))) as TokenResponse;
}

export async function exchangeAuthorizationCode(code: string): Promise<OutlookTokenStore> {
  const { clientId, clientSecret, redirectUri } = getOauthConfig();
  const payload = await requestToken(
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      scope: DEFAULT_SCOPES,
    })
  );

  if (!payload.access_token || !payload.refresh_token) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Failed to exchange authorization code for tokens"
    );
  }

  const accountEmail = await fetchMeEmail(payload.access_token);
  const store: OutlookTokenStore = {
    refreshToken: payload.refresh_token,
    accessToken: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 - 60_000,
    accountEmail: accountEmail ?? undefined,
    updatedAt: new Date().toISOString(),
  };
  await saveTokenStore(store);
  return store;
}

async function fetchMeEmail(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { mail?: string; userPrincipalName?: string };
    return data.mail || data.userPrincipalName || null;
  } catch {
    return null;
  }
}

/** Get a valid Graph access token, refreshing when needed. */
export async function getOutlookAccessToken(): Promise<string> {
  const file = await readTokenFile();
  if (file?.accessToken && file.expiresAt && file.expiresAt > Date.now()) {
    return file.accessToken;
  }

  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("Outlook is not connected. Connect it under Manage → Outlook Mail.");
  }

  const { clientId, clientSecret } = getOauthConfig();
  const payload = await requestToken(
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: DEFAULT_SCOPES,
    })
  );

  if (!payload.access_token) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Failed to refresh Outlook access token. Reconnect Outlook Mail."
    );
  }

  const next: OutlookTokenStore = {
    refreshToken: payload.refresh_token || refreshToken,
    accessToken: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 - 60_000,
    accountEmail: file?.accountEmail,
    updatedAt: new Date().toISOString(),
  };
  await saveTokenStore(next);
  return payload.access_token;
}
