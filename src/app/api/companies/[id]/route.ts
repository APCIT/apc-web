import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const COMPANIES_ROLES = ["admin", "IT", "staff", "reception"];

async function requireCompaniesAccess(): Promise<
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
  if (!COMPANIES_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** GET: single company for Edit form. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireCompaniesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const company = await prisma.companies.findUnique({
      where: { Id: id },
      select: { Id: true, Name: true, Abbreviation: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: company.Id,
      name: company.Name ?? "",
      abbreviation: company.Abbreviation ?? "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT: update company (Name, Abbreviation from request body). */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireCompaniesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const abbreviation = typeof body.abbreviation === "string" ? body.abbreviation.trim() : "";

    const company = await prisma.companies.update({
      where: { Id: id },
      data: {
        Name: name || null,
        Abbreviation: abbreviation || null,
      },
    });

    return NextResponse.json({
      id: company.Id,
      name: company.Name ?? "",
      abbreviation: company.Abbreviation ?? "",
    });
  } catch (e) {
    console.error(e);
    if ((e as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE: remove company and redirect to Index (client-side). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireCompaniesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await prisma.companies.delete({
      where: { Id: id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    if ((e as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
