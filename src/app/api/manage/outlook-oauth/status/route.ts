import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOutlookConnectionStatus } from "@/lib/outlook-oauth";

const ALLOWED = ["IT", "admin"];

/** GET: Outlook OAuth connection status. */
export async function GET() {
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

  const status = await getOutlookConnectionStatus();
  return NextResponse.json(status);
}
