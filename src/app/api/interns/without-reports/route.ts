import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Interns Without Reports page: admin, IT, reception, staff only. */
const ROLES = ["admin", "IT", "reception", "staff"];

async function requireAccess(): Promise<
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
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

export type WithoutReportsItem = {
  firstName: string;
  lastName: string;
  companyName: string;
};

export type WithoutReportsResponse = {
  reportTypes: string[];
  impactCalcList: WithoutReportsItem[];
  presentationList: WithoutReportsItem[];
};

/** GET: Lists of current interns missing Impact Calculator or Presentation. Auth: admin, IT, reception, staff. */
export async function GET() {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const interns = await prisma.interns.findMany({
      include: {
        AspNetUsers: { include: { Companies: true } },
      },
    });
    interns.sort((a, b) => {
      const la = a.AspNetUsers?.LastName ?? "";
      const lb = b.AspNetUsers?.LastName ?? "";
      const c = la.localeCompare(lb);
      if (c !== 0) return c;
      const fa = a.AspNetUsers?.FirstName ?? "";
      const fb = b.AspNetUsers?.FirstName ?? "";
      return fa.localeCompare(fb);
    });

    const toItem = (i: (typeof interns)[0]): WithoutReportsItem => ({
      firstName: i.AspNetUsers?.FirstName ?? "",
      lastName: i.AspNetUsers?.LastName ?? "",
      companyName: i.AspNetUsers?.Companies?.Name ?? "",
    });

    const impactCalcList = interns.filter((i) => i.ImpactCalcId == null || i.ImpactCalcId.trim() === "").map(toItem);
    const presentationList = interns.filter((i) => i.PresentationId == null || i.PresentationId.trim() === "").map(toItem);

    const body: WithoutReportsResponse = {
      reportTypes: ["Impact Calculator", "Presentation"],
      impactCalcList,
      presentationList,
    };

    return NextResponse.json(body);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
