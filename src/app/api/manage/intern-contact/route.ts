import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatSubjectDate(d: Date) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const y = d.getFullYear();
  return `${m.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${y}`;
}

/** POST: submit intern help request. Body: { name, email, message }. Sends email; does not store in DB. */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const toEmail = process.env.INTERN_CONTACT_TO_EMAIL ?? "enstanko@cba.ua.edu";
    const subject = `${name}'s Help Request ${formatSubjectDate(new Date())}`;
    const html = `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
    const tenantId = process.env.MS_GRAPH_TENANT_ID;
    const clientId = process.env.MS_GRAPH_CLIENT_ID;
    const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET;
    const senderEmail = process.env.MS_GRAPH_SENDER_EMAIL ?? "apc-ua@outlook.com";

    if (!tenantId || !clientId || !clientSecret || !senderEmail) {
      console.warn("[intern-contact] Microsoft Graph email not configured.");
      return NextResponse.json(
        {
          error:
            "Email is not configured on the server. Please set MS_GRAPH_TENANT_ID, MS_GRAPH_CLIENT_ID, MS_GRAPH_CLIENT_SECRET, and MS_GRAPH_SENDER_EMAIL.",
        },
        { status: 500 }
      );
    }

    try {
      const tokenResponse = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
      });

      const tokenPayload = (await tokenResponse.json().catch(() => ({}))) as {
        access_token?: string;
      };
      const accessToken = tokenPayload.access_token;
      if (!tokenResponse.ok || !accessToken) {
        console.error("[intern-contact] Failed to acquire Microsoft Graph token:", tokenPayload);
        return NextResponse.json(
          { error: "Failed to authenticate with Microsoft Graph. Check Graph app credentials." },
          { status: 502 }
        );
      }

      const sendResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject,
            body: {
              contentType: "HTML",
              content: html,
            },
            toRecipients: [{ emailAddress: { address: toEmail } }],
            replyTo: [{ emailAddress: { address: email } }],
          },
          saveToSentItems: true,
        }),
      });

      if (!sendResponse.ok) {
        const sendPayload = await sendResponse.json().catch(() => ({}));
        console.error("[intern-contact] Failed to send Graph email:", sendPayload);
        return NextResponse.json(
          { error: "Failed to send email via Microsoft Graph. Check app permissions/mailbox access." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[intern-contact] Failed to send email:", err);
      return NextResponse.json(
        { error: "Failed to send email. Check Microsoft Graph configuration and server logs." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[intern-contact]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
