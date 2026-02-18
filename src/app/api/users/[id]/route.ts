import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Only IT role can delete users. */
const DELETE_USER_ROLES = ["IT"];

async function requireITAccess(): Promise<
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
  if (!DELETE_USER_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** DELETE: remove user (IT only). If user has Intern, deletes Timelogs, WorkSchedules, Intern first; then roles, logins, user. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireITAccess();
    if ("error" in access) return access.error;

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: id },
      include: { Interns: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (user.Interns) {
        await tx.timelogs.deleteMany({ where: { Intern_Id: id } });
        await tx.workSchedules.deleteMany({ where: { Intern_Id: id } });
        await tx.interns.delete({ where: { Id: id } });
      }
      await tx.aspNetUserRoles.deleteMany({ where: { UserId: id } });
      await tx.aspNetUserLogins.deleteMany({ where: { UserId: id } });
      await tx.aspNetUsers.delete({ where: { Id: id } });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
