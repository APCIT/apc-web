import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Roles that can see the Interns list. Client sees only their company's interns. */
const ROLES = ["IT", "admin", "staff", "reception", "client", "accountant"];

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
    include: {
      AspNetUserRoles: { include: { AspNetRoles: true } },
      Companies: true,
    },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
  if (!ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, roles, companyId: user.CompanyId ?? null };
}

/** Sunday at 00:00:00 local (week start). */
function startOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Sum (End - Start).TotalHours - Lunch for each timelog. */
function calcHours(
  timelogs: { Start: Date; End: Date; Lunch: number }[]
): number {
  let hours = 0;
  let lunchHours = 0;
  for (const t of timelogs) {
    const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
    const end = t.End instanceof Date ? t.End : new Date(t.End);
    hours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    lunchHours += t.Lunch ?? 0;
  }
  return hours - lunchHours;
}

/** Semester display: month 11 → Fall, 4 → Spring, 7 → Summer (Intern.Semester). */
function semesterToLabel(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 11) return `Fall ${year}`;
  if (month === 4) return `Spring ${year}`;
  if (month === 7) return `Summer ${year}`;
  return "";
}

/** Grad date display: month 12 → Fall, 5 → Spring, 8 → Summer (Intern.GradDate). */
function gradDateToLabel(d: Date): string {
  const date = d instanceof Date ? d : new Date(d);
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month === 12) return `Fall ${year}`;
  if (month === 5) return `Spring ${year}`;
  if (month === 8) return `Summer ${year}`;
  return "";
}

/** May–August = summer (40 hr cap); else 20 hr cap. */
function isSummer(): boolean {
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 8;
}

export type InternListItem = {
  id: string;
  cwid: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  companyName: string;
  semester: string;
  level: string | null;
  gradDate: string;
  wage: number;
  dob: string;
  hoursThisWeek: number;
  hoursBar: number;
  nameStyle: "text-bold" | "text-normal";
  companyStyle: "text-bold" | "text-normal";
};

export type InternsListResponse = {
  interns: InternListItem[];
  weekStart: string;
  isSummer: boolean;
};

/** GET: list current interns with optional sortby. Query: sortby=lastname|company|hours|graddate. */
export async function GET(request: NextRequest) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;
    const { roles, companyId } = access;

    const sortby = request.nextUrl.searchParams.get("sortby")?.toLowerCase().trim() || "";
    const weekStart = startOfWeek(new Date());
    const weekStartTime = weekStart.getTime();

    const interns = await prisma.interns.findMany({
      include: {
        AspNetUsers: { include: { Companies: true } },
        Timelogs: true,
      },
    });

    let filtered = interns;
    if (roles.includes("client") && companyId != null) {
      filtered = interns.filter((i) => i.AspNetUsers?.CompanyId === companyId);
    }

    const isSummerCap = isSummer();
    const capHours = isSummerCap ? 40 : 20;

    type Row = (typeof filtered)[0];
    const withHours = filtered.map((row): Row & { hoursThisWeek: number; hoursBar: number } => {
      const timelogs = row.Timelogs ?? [];
      const weekStartDate = new Date(weekStartTime);
      weekStartDate.setHours(0, 0, 0, 0);

      const forFlag = timelogs.filter((t) => {
        const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        for (let i = 0; i <= 5; i++) {
          const d = new Date(weekStartDate);
          d.setDate(d.getDate() + i);
          if (startDate === d.getTime()) return true;
        }
        for (let i = 7; i <= 13; i++) {
          const d = new Date(weekStartDate);
          d.setDate(d.getDate() + i);
          if (startDate === d.getTime()) return true;
        }
        return false;
      });
      const hoursThisWeek = calcHours(forFlag);

      const forBar = timelogs.filter((t) => {
        const start = t.Start instanceof Date ? t.Start : new Date(t.Start);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        return startDate >= weekStartTime;
      });
      const hoursBar = calcHours(forBar);

      return { ...row, hoursThisWeek, hoursBar };
    });

    const nameStyle = sortby === "lastname" ? "text-bold" : "text-normal";
    const companyStyle = sortby === "company" || sortby === "graddate" ? "text-bold" : "text-normal";

    let sorted: typeof withHours;
    if (sortby === "company") {
      sorted = [...withHours].sort((a, b) => {
        const na = a.AspNetUsers?.Companies?.Name ?? "";
        const nb = b.AspNetUsers?.Companies?.Name ?? "";
        return na.localeCompare(nb);
      });
    } else if (sortby === "hours") {
      sorted = [...withHours].sort((a, b) => b.hoursBar - a.hoursBar);
    } else if (sortby === "graddate") {
      sorted = [...withHours].sort((a, b) => {
        const ta = a.GradDate instanceof Date ? a.GradDate.getTime() : new Date(a.GradDate).getTime();
        const tb = b.GradDate instanceof Date ? b.GradDate.getTime() : new Date(b.GradDate).getTime();
        return ta - tb;
      });
    } else {
      sorted = [...withHours].sort((a, b) => {
        const lastA = a.AspNetUsers?.LastName ?? "";
        const lastB = b.AspNetUsers?.LastName ?? "";
        const c = lastA.localeCompare(lastB);
        if (c !== 0) return c;
        const firstA = a.AspNetUsers?.FirstName ?? "";
        const firstB = b.AspNetUsers?.FirstName ?? "";
        return firstA.localeCompare(firstB);
      });
    }

    const list: InternListItem[] = sorted.map((row) => ({
      id: row.Id,
      cwid: row.CWID ?? null,
      firstName: row.AspNetUsers?.FirstName ?? "",
      lastName: row.AspNetUsers?.LastName ?? "",
      email: row.AspNetUsers?.Email ?? null,
      phone: row.Phone ?? null,
      companyName: row.AspNetUsers?.Companies?.Name ?? "",
      semester: semesterToLabel(row.Semester),
      level: row.Level ?? null,
      gradDate: gradDateToLabel(row.GradDate),
      wage: row.Wage ?? 0,
      dob: row.Dob instanceof Date ? row.Dob.toISOString() : String(row.Dob),
      hoursThisWeek: row.hoursThisWeek,
      hoursBar: row.hoursBar,
      nameStyle,
      companyStyle,
    }));

    return NextResponse.json({
      interns: list,
      weekStart: weekStart.toISOString(),
      isSummer: isSummerCap,
    } as InternsListResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
