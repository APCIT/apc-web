import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ROLES = ["IT", "admin", "staff", "reception", "client", "accountant"];

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true; companyId: number | null }
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
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, companyId: user.CompanyId ?? null };
}

/** PATCH: set intern mentor fields. Body: mentorName, mentorTitle, mentorPhone, mentorEmail. Same access as Details. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const mentorName = typeof body.mentorName === "string" ? body.mentorName : null;
    const mentorTitle = typeof body.mentorTitle === "string" ? body.mentorTitle : null;
    const mentorPhone = typeof body.mentorPhone === "string" ? body.mentorPhone : null;
    const mentorEmail = typeof body.mentorEmail === "string" ? body.mentorEmail : null;

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: { AspNetUsers: true },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }
    if (access.companyId != null && intern.AspNetUsers?.CompanyId !== access.companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.interns.update({
      where: { Id: id },
      data: {
        MentorName: mentorName ?? undefined,
        MentorTitle: mentorTitle ?? undefined,
        MentorPhone: mentorPhone ?? undefined,
        MentorEmail: mentorEmail ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
