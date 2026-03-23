import { NextResponse } from "next/server";
import { verify as verifyPassword } from "aspnetcore-identity-password-hasher";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashIdentityV2 } from "@/lib/password-identity-v2";

/** POST: change password for the current user. Body: { currentPassword, newPassword }. */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: session.userId },
    });

    if (!user || !user.PasswordHash || String(user.PasswordHash).trim() === "") {
      return NextResponse.json(
        { error: "You do not have a local password set. Use Set Password instead." },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(currentPassword, String(user.PasswordHash).trim());
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
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
