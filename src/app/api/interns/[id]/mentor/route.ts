import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Temporarily no "client" — restore when clients may view Interns again
const STAFF_ROLES = ["IT", "admin", "staff", "reception", "accountant"];

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

/** Normalize phone to digits only. */
function phoneDigitsOnly(phone: string | null): string {
  if (phone == null || typeof phone !== "string") return "";
  return phone.replace(/\D/g, "");
}

/** PATCH: set intern mentor fields. Body: mentorName, mentorTitle, mentorPhone, mentorEmail. Staff or intern (own record). Saves only when all four are valid; phone stored as digits only (must be 10 digits). */
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
    const mentorName = typeof body.mentorName === "string" ? body.mentorName.trim() : "";
    const mentorTitle = typeof body.mentorTitle === "string" ? body.mentorTitle.trim() : "";
    const mentorPhoneRaw = typeof body.mentorPhone === "string" ? body.mentorPhone : "";
    const mentorEmail = typeof body.mentorEmail === "string" ? body.mentorEmail.trim() : "";

    const mentorPhone = phoneDigitsOnly(mentorPhoneRaw);

    if (!mentorName) {
      return NextResponse.json({ error: "Mentor name is required." }, { status: 400 });
    }
    if (!mentorTitle) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }
    if (mentorPhone.length !== 10) {
      return NextResponse.json({ error: "Phone must be exactly 10 digits." }, { status: 400 });
    }
    if (!mentorEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: { AspNetUsers: true },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    await prisma.interns.update({
      where: { Id: id },
      data: {
        MentorName: mentorName,
        MentorTitle: mentorTitle,
        MentorPhone: mentorPhone,
        MentorEmail: mentorEmail,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
