import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashIdentityV2 } from "@/lib/password-identity-v2";

const USERS_ROLES = ["admin", "IT"];

async function requireUsersAccess(): Promise<
  | { error: NextResponse }
  | { ok: true }
> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!USERS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** POST: set user password to Alabama2025! (admin/IT only). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireUsersAccess();
    if ("error" in access) return access.error;

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const target = await prisma.aspNetUsers.findUnique({
      where: { Id: id },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPasswordHash = await hashIdentityV2("Alabama2025!");
    await prisma.aspNetUsers.update({
      where: { Id: id },
      data: { PasswordHash: newPasswordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
