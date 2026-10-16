import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clearTokenStore } from "@/lib/outlook-oauth";

const ALLOWED = ["IT", "admin"];

/** POST: clear stored Outlook OAuth tokens. */
export async function POST() {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await clearTokenStore();
  return NextResponse.json({ ok: true });
}
