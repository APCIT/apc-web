import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const APPLICANTS_ROLES = ["admin", "IT", "staff", "reception"];

async function requireApplicantsAccess(): Promise<
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
  if (!APPLICANTS_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

export type ApplicantRow = {
  id: number;
  interviewStatus: boolean;
  callBack: boolean;
  callBackDate: string;
  prevIntern: boolean;
  note: string | null;
  firstName: string | null;
  validEmp: boolean;
  dateApplied: string;
  lastName: string | null;
  major: string | null;
  school: string | null;
  level: string | null;
  gradDate: string;
  skills: string | null;
  foreignLanguage: string | null;
  resumeId: string | null;
};

const todayStart = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Tie-break: CallBack desc, PrevIntern desc, InterviewStatus desc, has Note desc, DateApplied desc, LastName asc, FirstName asc */
function tieBreak(a: ApplicantRow, b: ApplicantRow): number {
  if (a.callBack !== b.callBack) return a.callBack ? -1 : 1;
  if (a.prevIntern !== b.prevIntern) return a.prevIntern ? -1 : 1;
  if (a.interviewStatus !== b.interviewStatus) return a.interviewStatus ? -1 : 1;
  const aNote = !!a.note?.trim();
  const bNote = !!b.note?.trim();
  if (aNote !== bNote) return aNote ? -1 : 1;
  const da = new Date(a.dateApplied).getTime();
  const db = new Date(b.dateApplied).getTime();
  if (da !== db) return db - da;
  const ln = (a.lastName ?? "").localeCompare(b.lastName ?? "", undefined, { sensitivity: "base" });
  if (ln !== 0) return ln;
  return (a.firstName ?? "").localeCompare(b.firstName ?? "", undefined, { sensitivity: "base" });
}

function orderApplicants(rows: ApplicantRow[], sortBy: string): ApplicantRow[] {
  const str = (s: string | null) => s ?? "";
  const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });
  const copy = [...rows];

  switch (sortBy) {
    case "symbol": {
      // Symbol order: callback first, then prev intern, then interviewed, then has note; within each, tie-break
      return copy.sort((a, b) => {
        const order = (r: ApplicantRow) => {
          if (r.callBack) return 0;
          if (r.prevIntern) return 1;
          if (r.interviewStatus && !r.callBack && !(r.note?.trim())) return 2;
          if (r.note?.trim() && !r.callBack) return 3;
          return 4;
        };
        const va = order(a);
        const vb = order(b);
        if (va !== vb) return va - vb;
        return tieBreak(a, b);
      });
    }
    case "level":
      return copy.sort((a, b) => {
        const v = cmp(str(a.level), str(b.level));
        if (v !== 0) return v;
        return tieBreak(a, b);
      });
    case "major":
      return copy.sort((a, b) => {
        const v = cmp(str(a.major), str(b.major));
        if (v !== 0) return v;
        return tieBreak(a, b);
      });
    case "name":
      return copy.sort((a, b) => {
        let v = cmp(str(a.lastName), str(b.lastName));
        if (v !== 0) return v;
        v = cmp(str(a.firstName), str(b.firstName));
        if (v !== 0) return v;
        return tieBreak(a, b);
      });
    case "school":
      return copy.sort((a, b) => {
        const v = cmp(str(a.school), str(b.school));
        if (v !== 0) return v;
        return tieBreak(a, b);
      });
    case "graddate":
    case "graduation date":
      return copy.sort((a, b) => {
        const da = new Date(a.gradDate).getTime();
        const db = new Date(b.gradDate).getTime();
        if (da !== db) return da - db;
        return tieBreak(a, b);
      });
    case "recent":
    default: {
      // Recent: DateApplied desc then tie-break
      return copy.sort((a, b) => {
        const da = new Date(a.dateApplied).getTime();
        const db = new Date(b.dateApplied).getTime();
        if (db !== da) return db - da;
        return tieBreak(a, b);
      });
    }
  }
}

/** GET: applicants list. Before building: delete applicants with GradDate < today; then load and sort. Query ?sortBy= symbol|level|major|name|recent|school|graddate (default recent). */
export async function GET(request: Request) {
  try {
    const access = await requireApplicantsAccess();
    if ("error" in access) return access.error;

    const { searchParams } = new URL(request.url);
    const sortByRaw = (searchParams.get("sortBy") ?? "").trim().toLowerCase();
    const sortBy =
      ["symbol", "level", "major", "name", "recent", "school", "graddate", "graduation date"].includes(sortByRaw)
        ? sortByRaw === "graduation date"
          ? "graddate"
          : sortByRaw
        : "recent";

    const today = todayStart();

    // 1) Delete applicants with GradDate < today
    await prisma.applicants.deleteMany({
      where: { GradDate: { lt: today } },
    });

    // 2) Load remaining applicants
    const rows = await prisma.applicants.findMany({
      orderBy: { Id: "asc" },
    });

    const applicants: ApplicantRow[] = rows.map((r) => ({
      id: r.Id,
      interviewStatus: r.InterviewStatus,
      callBack: r.CallBack,
      callBackDate: r.CallBackDate.toISOString(),
      prevIntern: r.PrevIntern,
      note: r.Note,
      firstName: r.FirstName,
      validEmp: r.ValidEmp ?? false,
      dateApplied: r.DateApplied.toISOString(),
      lastName: r.LastName,
      major: r.Major,
      school: r.School,
      level: r.Level,
      gradDate: r.GradDate.toISOString(),
      skills: r.Skills,
      foreignLanguage: r.ForeignLanguage,
      resumeId: r.ResumeId,
    }));

    const ordered = orderApplicants(applicants, sortBy);

    return NextResponse.json({
      applicants: ordered,
      sortBy,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
