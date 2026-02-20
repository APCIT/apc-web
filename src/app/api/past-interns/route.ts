import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const PAST_INTERNS_ROLES = ["IT", "admin", "staff", "reception"];

async function requirePastInternsAccess(): Promise<
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
  if (!PAST_INTERNS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** Month 4 → Spring, 7 → Summer, 11 → Fall (C# 1-based; DB stores first day of that month). */
function semesterToLabel(d: Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const month = date.getUTCMonth() + 1; // 1-12
  const year = date.getUTCFullYear();
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  if (month === 11) return `Fall ${year}`;
  return `Semester ${year}`;
}

export type PastInternItem = {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  school: string;
  semester: string;
  semesterLabel: string;
  midSemReportId: string | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

/** GET: semesters (distinct, desc) and past interns grouped by semester (Company asc, Major asc within each). */
export async function GET() {
  try {
    const access = await requirePastInternsAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.pastInterns.findMany({
      orderBy: { Semester: "desc" },
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Company: true,
        School: true,
        Major: true,
        Semester: true,
        MidSemReportId: true,
        ImpactCalcId: true,
        PresentationId: true,
      },
    });

    const distinctSemesters: Date[] = [];
    const seen = new Set<number>();
    for (const r of rows) {
      const t = r.Semester.getTime();
      if (!seen.has(t)) {
        seen.add(t);
        distinctSemesters.push(r.Semester);
      }
    }

    const semesters = distinctSemesters.map((s) => semesterToLabel(s));
    const pastInternsGroupedBySemester: PastInternItem[][] = [];

    for (const semDate of distinctSemesters) {
      const forSemester = rows
        .filter((r) => r.Semester.getTime() === semDate.getTime())
        .sort((a, b) => {
          const c = (a.Company ?? "").localeCompare(b.Company ?? "");
          if (c !== 0) return c;
          return (a.Major ?? "").localeCompare(b.Major ?? "");
        })
        .map((r) => ({
          id: r.Id,
          firstName: r.FirstName ?? "",
          lastName: r.LastName ?? "",
          company: r.Company ?? "",
          school: r.School ?? "",
          semester: r.Semester.toISOString(),
          semesterLabel: semesterToLabel(r.Semester),
          midSemReportId: r.MidSemReportId,
          impactCalcId: r.ImpactCalcId,
          presentationId: r.PresentationId,
        }));
      pastInternsGroupedBySemester.push(forSemester);
    }

    return NextResponse.json({
      semesters,
      pastInternsGroupedBySemester,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
