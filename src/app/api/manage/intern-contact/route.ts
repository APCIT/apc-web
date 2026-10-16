import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMailProvider, isMailConfigured, sendMail } from "@/lib/mail";

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
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!(await isMailConfigured())) {
      console.warn("[intern-contact] Email not configured / Outlook not connected.");
      return NextResponse.json(
        {
          error:
            "Email is not configured. Connect Outlook under Manage → Outlook Mail, or set RESEND_API_KEY.",
        },
        { status: 500 }
      );
    }

    const toEmail = process.env.INTERN_CONTACT_TO_EMAIL ?? "enstanko@cba.ua.edu";
    const subject = `${name}'s Help Request ${formatSubjectDate(new Date())}`;
    const html = `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

    try {
      await sendMail({
        to: toEmail,
        subject,
        html,
        replyTo: email,
      });
    } catch (err) {
      const provider = await getMailProvider();
      console.error(`[intern-contact] Failed to send email via ${provider}:`, err);
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Failed to send email. Check Outlook connection or Resend config.",
        },
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
