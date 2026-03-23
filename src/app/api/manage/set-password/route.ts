import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashIdentityV2 } from "@/lib/password-identity-v2";

/** POST: set initial local password (for users who currently have no password). Body: { newPassword }. */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.PasswordHash != null && String(user.PasswordHash).trim() !== "") {
      return NextResponse.json(
        { error: "You already have a password set. Use Change Password instead." },
        { status: 400 }
      );
    }

    const newHash = await hashIdentityV2(newPassword);
    await prisma.aspNetUsers.update({
      where: { Id: session.userId },
      data: { PasswordHash: newHash },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
