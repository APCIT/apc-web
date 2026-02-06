import { NextResponse } from "next/server";
import { verify as verifyPassword } from "aspnetcore-identity-password-hasher";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = body?.username;
    const password = body?.password;
    const rememberMe = Boolean(body?.rememberMe);

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { UserName: username },
      include: {
        AspNetUserRoles: { include: { AspNetRoles: true } },
      },
    });

    if (!user || user.PasswordHash == null || user.PasswordHash === "") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedPassword = String(user.PasswordHash).trim();
    let isValid = false;
    try {
      isValid = await verifyPassword(String(password), hashedPassword);
    } catch {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
    await createSession(
      {
        userId: user.Id,
        userName: user.UserName,
        roles,
      },
      rememberMe
    );

    return NextResponse.json({
      user: {
        id: user.Id,
        userName: user.UserName,
        firstName: user.FirstName,
        lastName: user.LastName,
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
