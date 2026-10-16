import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { respondWithImpactCalc } from "@/lib/impact-calc-download";

/** Matches canViewImpactCalc on the intern details page. */
const VIEW_ROLES = ["admin", "IT", "staff", "reception"];

async function requireViewAccess(
  internId: string
): Promise<{ error: NextResponse } | { ok: true }> {
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

  if (roles.includes("intern")) {
    if (session.userId !== internId) {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { ok: true };
  }

  if (!VIEW_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true };
}

/** GET: the intern's uploaded impact calculator, named after the intern rather
 *  than the generated blob name staff currently see. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const access = await requireViewAccess(id);
    if ("error" in access) return access.error;

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
      include: { AspNetUsers: { select: { FirstName: true, LastName: true } } },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const blobName = intern.ImpactCalcId?.trim();
    if (!blobName) {
      return NextResponse.json(
        { error: "No impact calculator has been uploaded for this intern." },
        { status: 404 }
      );
    }

    return respondWithImpactCalc({
      blobName,
      firstName: intern.AspNetUsers?.FirstName ?? "",
      lastName: intern.AspNetUsers?.LastName ?? "",
      semester: intern.Semester,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
