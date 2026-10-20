import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Temporarily no "client" — restore when clients may view Interns again
const ROLES = ["IT", "admin", "staff", "reception", "accountant"];

const num = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v)
    ? v
    : typeof v === "string"
      ? parseInt(v, 10)
      : NaN;

/** Build DateTime for GradDate (month 5|8|12, year). Uses UTC first of month. */
function buildGradDate(month: number, year: number): Date | null {
  if (![5, 8, 12].includes(month) || !Number.isInteger(year) || year < 1900 || year > 2100) {
    return null;
  }
  return new Date(Date.UTC(year, month - 1, 1));
}

function gradDateToLabel(d: Date): string {
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();
  if (month === 12) return `Fall ${year}`;
  if (month === 5) return `Spring ${year}`;
  if (month === 8) return `Summer ${year}`;
  return "";
}

async function requireAccess(): Promise<
  | { error: NextResponse }
  | { ok: true; roles: string[]; companyId: number | null }
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
  // Same as Details GET: company scoping only applies to client users.
  return { ok: true, roles, companyId: user.CompanyId ?? null };
}

/** PATCH: set intern graduation date. Body: { gradMonth: 5|8|12, gradYear: number }. Same access as Details. */
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
    const gradMonth = num(body.gradMonth);
    const gradYear = num(body.gradYear);
    const gd = buildGradDate(gradMonth, gradYear);
    if (!gd) {
      return NextResponse.json(
        { error: "Invalid graduation date (month must be May, August, or December)" },
        { status: 400 }
      );
    }

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: { AspNetUsers: true },
    });
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }
    if (
      access.roles.includes("client") &&
      access.companyId != null &&
      intern.AspNetUsers?.CompanyId !== access.companyId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.interns.update({
      where: { Id: id },
      data: { GradDate: gd },
    });

    return NextResponse.json({
      ok: true,
      gradDate: gradDateToLabel(gd),
      gradDateIso: gd.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
