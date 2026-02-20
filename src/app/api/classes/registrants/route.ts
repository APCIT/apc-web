import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const REGISTRANTS_ROLES = ["IT", "admin", "staff", "reception"];

async function requireRegistrantsAccess(): Promise<
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
  if (!REGISTRANTS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

export type ClassRegRow = {
  id: number;
  dateApplied: string;
  class: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
};

/** Apply ordering by sortBy. Default (recent): DateApplied desc, LastName desc, FirstName desc. */
function orderRegistrants(rows: ClassRegRow[], sortBy: string): ClassRegRow[] {
  const str = (s: string) => s ?? "";
  const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });
  const cmpDesc = (a: string, b: string) => -cmp(a, b);
  const dateDesc = (a: ClassRegRow, b: ClassRegRow) =>
    new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();

  if (sortBy === "Class") {
    return [...rows].sort((a, b) => {
      let v = cmp(str(a.class), str(b.class));
      if (v !== 0) return v;
      v = cmpDesc(str(a.company), str(b.company));
      if (v !== 0) return v;
      v = dateDesc(a, b);
      if (v !== 0) return v;
      v = cmpDesc(str(a.lastName), str(b.lastName));
      if (v !== 0) return v;
      return cmpDesc(str(a.firstName), str(b.firstName));
    });
  }
  if (sortBy === "Company") {
    return [...rows].sort((a, b) => {
      let v = cmp(str(a.company), str(b.company));
      if (v !== 0) return v;
      v = dateDesc(a, b);
      if (v !== 0) return v;
      v = cmpDesc(str(a.lastName), str(b.lastName));
      if (v !== 0) return v;
      return cmpDesc(str(a.firstName), str(b.firstName));
    });
  }
  if (sortBy === "LastName") {
    return [...rows].sort((a, b) => {
      let v = cmp(str(a.lastName), str(b.lastName));
      if (v !== 0) return v;
      v = cmpDesc(str(a.firstName), str(b.firstName));
      if (v !== 0) return v;
      v = dateDesc(a, b);
      if (v !== 0) return v;
      v = cmpDesc(str(a.company), str(b.company));
      if (v !== 0) return v;
      return cmpDesc(str(a.class), str(b.class));
    });
  }
  // Default: recent — DateApplied desc, LastName desc, FirstName desc
  return [...rows].sort((a, b) => {
    let v = dateDesc(a, b);
    if (v !== 0) return v;
    v = cmpDesc(str(a.lastName), str(b.lastName));
    if (v !== 0) return v;
    return cmpDesc(str(a.firstName), str(b.firstName));
  });
}

/** GET: all class registrants. Query ?sortBy=Class|Company|LastName (default = recent). */
export async function GET(request: Request) {
  try {
    const access = await requireRegistrantsAccess();
    if ("error" in access) return access.error;

    const { searchParams } = new URL(request.url);
    const sortBy = (searchParams.get("sortBy") ?? "").trim();

    const rows = await prisma.classRegs.findMany({
      orderBy: { Id: "asc" },
    });

    const registrants: ClassRegRow[] = rows.map((r) => ({
      id: r.Id,
      dateApplied: r.DateApplied.toISOString(),
      class: r.Class ?? "",
      firstName: r.FirstName ?? "",
      lastName: r.LastName ?? "",
      email: r.Email ?? "",
      phone: r.Phone ?? "",
      company: r.Company ?? "",
      jobTitle: r.JobTitle ?? "",
    }));

    const ordered = orderRegistrants(registrants, sortBy);
    return NextResponse.json(ordered);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
