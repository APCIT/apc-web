import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const STAFF_ROLES = ["IT", "admin", "staff", "reception", "client", "accountant"];

/** Allow staff (with company check) or intern updating their own record (id === session.userId). */
async function requireAccess(internId: string): Promise<
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
  if (internId === session.userId && roles.includes("intern")) {
    return { ok: true };
  }
  if (!STAFF_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  const intern = await prisma.interns.findUnique({
    where: { Id: internId },
    include: { AspNetUsers: true },
  });
  if (!intern) {
    return { error: NextResponse.json({ error: "Intern not found" }, { status: 404 }) };
  }
  if (user.CompanyId != null && intern.AspNetUsers?.CompanyId !== user.CompanyId) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** PATCH: set intern hometown. Allowed for staff (same as mentor) or intern updating own record. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const access = await requireAccess(id);
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const hometown = typeof body.hometown === "string" ? body.hometown.trim() || null : null;

    await prisma.interns.update({
      where: { Id: id },
      data: { Hometown: hometown ?? undefined },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
