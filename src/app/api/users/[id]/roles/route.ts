import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ROLES_IT_ONLY = ["IT"];

const ALL_ROLE_NAMES = [
  "accountant",
  "admin",
  "advisor",
  "client",
  "IT",
  "intern",
  "reception",
  "staff",
] as const;

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
  const roleNames = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES_IT_ONLY.some((r) => roleNames.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** GET: return user name and which roles they have (IT only). */
export async function GET(
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
      include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRoleNamesLower = new Set(
      user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name.toLowerCase())
    );

    const roles: Record<string, boolean> = {};
    for (const name of ALL_ROLE_NAMES) {
      roles[name] = userRoleNamesLower.has(name.toLowerCase());
    }

    return NextResponse.json({
      firstName: user.FirstName ?? "",
      lastName: user.LastName ?? "",
      roles,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT: update user roles from checkbox state (IT only). Intern is not updated. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireITAccess();
    if ("error" in access) return access.error;

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: id },
      include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const editableRoles = ["accountant", "admin", "advisor", "client", "IT", "reception", "staff"] as const;

    const currentRoleIds = new Set(user.AspNetUserRoles.map((ur) => ur.RoleId));

    const allRoles = await prisma.aspNetRoles.findMany({
      select: { Id: true, Name: true },
    });
    const roleNameToId = new Map(
      allRoles.map((r) => [r.Name.toLowerCase(), r.Id])
    );

    for (const roleName of editableRoles) {
      const roleId = roleNameToId.get(roleName.toLowerCase());
      if (!roleId) continue;

      const wantChecked = Boolean(body[roleName]);
      const hasRole = currentRoleIds.has(roleId);

      if (wantChecked && !hasRole) {
        await prisma.aspNetUserRoles.create({
          data: { UserId: id, RoleId: roleId },
        });
        currentRoleIds.add(roleId);
      } else if (!wantChecked && hasRole) {
        await prisma.aspNetUserRoles.deleteMany({
          where: { UserId: id, RoleId: roleId },
        });
        currentRoleIds.delete(roleId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
