import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, destroySession, REVALIDATE_INTERVAL_MS, applySessionCookieConfig } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: session.userId },
      include: {
        AspNetUserRoles: { include: { AspNetRoles: true } },
      },
    });

    if (!user) {
      await destroySession();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.rememberMe && session.lastValidatedAt != null) {
      const elapsed = Date.now() - session.lastValidatedAt;
      if (elapsed >= REVALIDATE_INTERVAL_MS) {
        session.lastValidatedAt = Date.now();
        applySessionCookieConfig(session);
        await session.save();
      }
    }

    const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);

    return NextResponse.json({
      user: {
        id: user.Id,
        userName: user.UserName,
        firstName: user.FirstName,
        lastName: user.LastName,
        email: user.Email,
      },
      roles,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
