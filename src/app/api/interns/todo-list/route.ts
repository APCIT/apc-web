import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RequireInternOk = {
  ok: true;
  internId: string;
};

async function requireIntern():
  Promise<{ error: NextResponse } | RequireInternOk> {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: {
      AspNetUserRoles: { include: { AspNetRoles: true } },
    },
  });

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!roles.includes("intern")) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const intern = await prisma.interns.findUnique({
    where: { Id: session.userId },
    include: { AspNetUsers: true },
  });

  if (!intern) {
    return {
      error: NextResponse.json(
        { error: "Intern record not found" },
        { status: 404 },
      ),
    };
  }

  return { ok: true, internId: intern.Id };
}

export type TodoListResponse = {
  internId: string;
  firstName: string;
  lastName: string;
  semesterMonth: number | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

export async function GET() {
  try {
    const access = await requireIntern();
    if ("error" in access) return access.error;

    const intern = await prisma.interns.findUnique({
      where: { Id: access.internId },
      include: { AspNetUsers: true },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    // Semester month (1–12) drives due date on To-Do List: April (4) → 5/1, July (7) → 8/1, November (11) → 12/1 of current year.
    const semester = intern.Semester instanceof Date
      ? intern.Semester
      : new Date(intern.Semester);
    const semesterMonth = Number.isNaN(semester.getTime())
      ? null
      : semester.getUTCMonth() + 1;

    const payload: TodoListResponse = {
      internId: intern.Id,
      firstName: intern.AspNetUsers?.FirstName ?? "",
      lastName: intern.AspNetUsers?.LastName ?? "",
      semesterMonth,
      impactCalcId: intern.ImpactCalcId ?? null,
      presentationId: intern.PresentationId ?? null,
    };

    return NextResponse.json(payload);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

