import { Resend } from "resend";
import {
  getOutlookAccessToken,
  getOutlookConnectionStatus,
  getStoredRefreshToken,
  isOutlookOauthConfigured,
} from "@/lib/outlook-oauth";

export type MailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export type SendMailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

function toBase64(content: Buffer | string): string {
  if (Buffer.isBuffer(content)) return content.toString("base64");
  return Buffer.from(content).toString("base64");
}

function toList(value: string | string[]): string[] {
  return (Array.isArray(value) ? value : [value]).map((s) => s.trim()).filter(Boolean);
}

/** True when Outlook OAuth is connected, or Resend API key is set. */
export async function isMailConfigured(): Promise<boolean> {
  if (isOutlookOauthConfigured() && (await getStoredRefreshToken())) return true;
  return Boolean(process.env.RESEND_API_KEY);
}

export async function getMailProvider(): Promise<"outlook" | "resend" | null> {
  if (isOutlookOauthConfigured() && (await getStoredRefreshToken())) return "outlook";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

async function sendViaOutlook(options: SendMailOptions): Promise<void> {
  const accessToken = await getOutlookAccessToken();
  const to = toList(options.to).map((address) => ({
    emailAddress: { address },
  }));
  if (to.length === 0) throw new Error("No recipients");

  const message: Record<string, unknown> = {
    subject: options.subject,
    body: { contentType: "HTML", content: options.html },
    toRecipients: to,
  };

  if (options.replyTo) {
    message.replyTo = [{ emailAddress: { address: options.replyTo } }];
  }

  if (options.attachments?.length) {
    message.attachments = options.attachments.map((a) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: a.filename,
      contentType: a.contentType ?? "application/octet-stream",
      contentBytes: toBase64(a.content),
    }));
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const msg =
      (payload as { error?: { message?: string } })?.error?.message ||
      `Outlook Graph sendMail failed (${res.status})`;
    throw new Error(msg);
  }
}

async function sendViaResend(options: SendMailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: toBase64(a.content),
      contentType: a.contentType,
    })),
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send email");
  }
}

/**
 * Prefer connected Outlook OAuth (sends as apc-ua@outlook.com).
 * Falls back to Resend when Outlook is not connected.
 */
export async function sendMail(options: SendMailOptions): Promise<void> {
  const provider = await getMailProvider();
  if (provider === "outlook") {
    await sendViaOutlook(options);
    return;
  }
  if (provider === "resend") {
    await sendViaResend(options);
    return;
  }
  const status = await getOutlookConnectionStatus();
  throw new Error(
    status.configured
      ? "Email is not connected. Open Manage → Outlook Mail and sign in as apc-ua@outlook.com."
      : "Email is not configured. Set MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET and connect Outlook, or set RESEND_API_KEY."
  );
}
