import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const COMPANIES_ROLES = ["admin", "IT", "staff", "reception"];

/** GET: list companies ordered by Name (Name and Abbreviation from DB). */
export async function GET() {
  try {
    const access = await requireCompaniesAccess();
    if ("error" in access) return access.error;

    const companies = await prisma.companies.findMany({
      orderBy: { Name: "asc" },
      select: { Id: true, Name: true, Abbreviation: true },
    });

    return NextResponse.json(
      companies.map((c) => ({
        id: c.Id,
        name: c.Name ?? "",
        abbreviation: c.Abbreviation ?? "",
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

/** POST: create company (Name, Abbreviation from request body). */
export async function POST(request: Request) {
  try {
    const access = await requireCompaniesAccess();
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const abbreviation = typeof body.abbreviation === "string" ? body.abbreviation.trim() : "";

    const company = await prisma.companies.create({
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
