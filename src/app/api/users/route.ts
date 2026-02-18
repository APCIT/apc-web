import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashIdentityV2 } from "@/lib/password-identity-v2";

const USERS_ROLES = ["admin", "IT"];
/** Only IT can create users (Create New User form). */
const CREATE_USER_ROLES = ["IT"];

const ROLE_ORDER = [
  "accountant",
  "admin",
  "advisor",
  "client",
  "IT",
  "staff",
  "intern",
  "reception",
] as const;

type RoleName = (typeof ROLE_ORDER)[number];

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
  if (!CREATE_USER_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** GET: list all users with roles and company, grouped by role (and usersWithoutRole). */
export async function GET() {
  try {
    const access = await requireUsersAccess();
    if ("error" in access) return access.error;

    const users = await prisma.aspNetUsers.findMany({
      orderBy: { UserName: "asc" },
      include: {
        AspNetUserRoles: { include: { AspNetRoles: true } },
        Companies: true,
        Interns: true,
      },
    });

    const roleNameToId = new Map<string, string>();
    const allRoles = await prisma.aspNetRoles.findMany({
      select: { Id: true, Name: true },
    });
    for (const r of allRoles) {
      roleNameToId.set(r.Name, r.Id);
    }

    const byRole: Record<string, typeof users> = {};
    for (const roleName of ROLE_ORDER) {
      const roleId = roleNameToId.get(roleName);
      if (!roleId) {
        byRole[roleName] = [];
        continue;
      }
      byRole[roleName] = users.filter((u) =>
        u.AspNetUserRoles.some((ur) => ur.RoleId === roleId)
      );
    }
    const usersWithoutRole = users.filter((u) => u.AspNetUserRoles.length === 0);

    const toItem = (u: (typeof users)[0]) => ({
      id: u.Id,
      userName: u.UserName,
      firstName: u.FirstName ?? "",
      lastName: u.LastName ?? "",
      email: u.Email ?? "",
      companyName: u.Companies?.Name ?? "",
      canDelete: u.Interns == null,
    });

    return NextResponse.json({
      byRole: Object.fromEntries(
        ROLE_ORDER.map((name) => [name, byRole[name]!.map(toItem)])
      ),
      usersWithoutRole: usersWithoutRole.map(toItem),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST: create user (firstName, lastName, email, companyId, role); default password Alabama2025! (IT only). */
export async function POST(request: Request) {
  try {
    const access = await requireITAccess();
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const companyId = typeof body.companyId === "number" ? body.companyId : Number(body.companyId);
    const roleName = typeof body.role === "string" ? body.role.trim() : "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json(
        { error: "Valid company is required" },
        { status: 400 }
      );
    }

    const allowedRoles = ["accountant", "admin", "advisor", "client", "IT", "reception", "staff"];
    if (!allowedRoles.includes(roleName)) {
      return NextResponse.json(
        { error: "Invalid or missing role" },
        { status: 400 }
      );
    }

    const company = await prisma.companies.findUnique({
      where: { Id: companyId },
    });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 400 }
      );
    }

    let role = await prisma.aspNetRoles.findFirst({
      where: { Name: roleName },
    });
    if (!role) {
      role = await prisma.aspNetRoles.create({
        data: {
          Id: crypto.randomUUID(),
          Name: roleName,
        },
      });
    }

    const baseUsername =
      (firstName.charAt(0).toLowerCase() || "") + lastName.toLowerCase().replace(/\s/g, "");
    let username = baseUsername;
    let suffix = 0;
    while (true) {
      const existing = await prisma.aspNetUsers.findUnique({
        where: { UserName: username },
      });
      if (!existing) break;
      suffix += 1;
      username = baseUsername + suffix;
    }

    const defaultPassword = "Alabama2025!";
    const passwordHash = await hashIdentityV2(defaultPassword);

    const userId = crypto.randomUUID();
    await prisma.aspNetUsers.create({
      data: {
        Id: userId,
        UserName: username,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        CompanyId: companyId,
        PasswordHash: passwordHash,
        EmailConfirmed: false,
        SecurityStamp: crypto.randomUUID(),
        PhoneNumber: null,
        PhoneNumberConfirmed: false,
        TwoFactorEnabled: false,
        LockoutEnabled: false,
        AccessFailedCount: 0,
      },
    });

    await prisma.aspNetUserRoles.create({
      data: { UserId: userId, RoleId: role.Id },
    });

    return NextResponse.json({
      id: userId,
      userName: username,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
