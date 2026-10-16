import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { respondWithImpactCalc } from "@/lib/impact-calc-download";

const PAST_INTERNS_ROLES = ["IT", "admin", "staff", "reception"];

async function requireAccess(): Promise<{ error: NextResponse } | { ok: true }> {
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
  if (!PAST_INTERNS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true };
}

/** GET: a past intern's impact calculator, named after the intern. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const access = await requireAccess();
    if ("error" in access) return access.error;

    const pastIntern = await prisma.pastInterns.findUnique({ where: { Id: id } });
    if (!pastIntern) {
      return NextResponse.json({ error: "Past intern not found" }, { status: 404 });
    }

    const blobName = pastIntern.ImpactCalcId?.trim();
    if (!blobName) {
      return NextResponse.json(
        { error: "No impact calculator was uploaded for this intern." },
        { status: 404 }
      );
    }

    return respondWithImpactCalc({
      blobName,
      firstName: pastIntern.FirstName ?? "",
      lastName: pastIntern.LastName ?? "",
      semester: pastIntern.Semester,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
