import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["IT", "admin", "staff"];

async function requireAccess() {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const };
}

type Ctx = { params: Promise<{ id: string }> };

/** PATCH: update active flag and/or selected intern Ids for a client user. */
export async function PATCH(request: Request, context: Ctx) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const client = await prisma.aspNetUsers.findUnique({
      where: { Id: id },
      include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    if (!client.AspNetUserRoles.some((ur) => ur.AspNetRoles.Name === "client")) {
      return NextResponse.json({ error: "User is not a client" }, { status: 400 });
    }

    const data: { Active?: boolean; InternIdsJson?: string | null } = {};

    if (typeof body.active === "boolean") {
      data.Active = body.active;
    }

    if ("selectedInternIds" in body) {
      if (body.selectedInternIds == null) {
        data.InternIdsJson = null;
      } else if (Array.isArray(body.selectedInternIds)) {
        const ids = body.selectedInternIds.filter(
          (x: unknown): x is string => typeof x === "string" && x.length > 0
        );
        const companyInterns = await prisma.interns.findMany({
          where: { AspNetUsers: { CompanyId: client.CompanyId } },
          select: { Id: true },
        });
        const allowed = new Set<string>(
          companyInterns.map((i: { Id: string }) => i.Id)
        );
        const filtered = ids.filter((i: string) => allowed.has(i));
        // null = all; empty array = none selected
        const allSelected =
          filtered.length === companyInterns.length && companyInterns.length > 0;
        data.InternIdsJson = allSelected ? null : JSON.stringify(filtered);
      } else {
        return NextResponse.json(
          { error: "selectedInternIds must be an array or null" },
          { status: 400 }
        );
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const settings = await prisma.clientTimelogSettings.upsert({
      where: { ClientUserId: id },
      create: {
        ClientUserId: id,
        Active: data.Active ?? true,
        InternIdsJson: data.InternIdsJson ?? null,
      },
      update: data,
    });

    return NextResponse.json({
      ok: true,
      active: settings.Active,
      selectedInternIds: settings.InternIdsJson
        ? (JSON.parse(settings.InternIdsJson) as string[])
        : null,
    });
  } catch (e) {
    console.error("[client-timelogs PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
