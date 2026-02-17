import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const CHARTS_ROLES = ["admin", "IT", "staff"];

/** Sort least to most (ascending by value). */
function buildChartArray(
  header: [string, string],
  rows: [string, number][]
): (string | number)[][] {
  const sorted = [...rows].sort((a, b) => (a[1] as number) - (b[1] as number));
  return [header, ...sorted];
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: session.userId },
      include: {
        AspNetUserRoles: { include: { AspNetRoles: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
    const hasRole = CHARTS_ROLES.some((r) => roles.includes(r));
    if (!hasRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [pastInterns, interns, timelogs] = await Promise.all([
      prisma.pastInterns.findMany({
        select: { Major: true, Company: true, HrsWorked: true },
      }),
      prisma.interns.findMany({
        include: {
          AspNetUsers: { include: { Companies: true } },
        },
      }),
      prisma.timelogs.findMany({
        include: {
          Interns: {
            include: {
              AspNetUsers: { include: { Companies: true } },
            },
          },
        },
      }),
    ]);

    const label = (s: string | null | undefined) =>
      s?.trim() || "Unknown";

    const majorCount = new Map<string, number>();
    for (const p of pastInterns) {
      const m = label(p.Major);
      majorCount.set(m, (majorCount.get(m) ?? 0) + 1);
    }
    const pastInternsByMajorData = buildChartArray(
      ["Major", "Past Intern Count"],
      Array.from(majorCount.entries()).map(([k, v]) => [k, v])
    );

    const currentMajorCount = new Map<string, number>();
    for (const i of interns) {
      const m = label(i.Major);
      currentMajorCount.set(m, (currentMajorCount.get(m) ?? 0) + 1);
    }
    const internsByMajorData = buildChartArray(
      ["Major", "Intern Count"],
      Array.from(currentMajorCount.entries()).map(([k, v]) => [k, v])
    );

    const pastCompanyCount = new Map<string, number>();
    for (const p of pastInterns) {
      const c = label(p.Company);
      pastCompanyCount.set(c, (pastCompanyCount.get(c) ?? 0) + 1);
    }
    const pastInternsByCompanyData = buildChartArray(
      ["Company", "Past Intern Count"],
      Array.from(pastCompanyCount.entries()).map(([k, v]) => [k, v])
    );

    const currentCompanyCount = new Map<string, number>();
    for (const i of interns) {
      const abbr = label(i.AspNetUsers?.Companies?.Abbreviation ?? i.AspNetUsers?.Companies?.Name);
      currentCompanyCount.set(abbr, (currentCompanyCount.get(abbr) ?? 0) + 1);
    }
    const internsByCompanyData = buildChartArray(
      ["Company", "Intern Count"],
      Array.from(currentCompanyCount.entries()).map(([k, v]) => [k, v])
    );

    const pastHrsByCompany = new Map<string, number>();
    for (const p of pastInterns) {
      const c = label(p.Company);
      const hrs = typeof p.HrsWorked === "number" ? p.HrsWorked : 0;
      pastHrsByCompany.set(c, (pastHrsByCompany.get(c) ?? 0) + hrs);
    }
    const pastHrsByCompanyData = buildChartArray(
      ["Company", "Hours Billed"],
      Array.from(pastHrsByCompany.entries()).map(([k, v]) => [k, v])
    );

    const currentHrsByCompany = new Map<string, number>();
    for (const t of timelogs) {
      const intern = t.Interns;
      if (!intern?.AspNetUsers?.Companies) continue;
      const abbr = label(intern.AspNetUsers.Companies.Abbreviation ?? intern.AspNetUsers.Companies.Name);
      const start = t.Start instanceof Date ? t.Start.getTime() : new Date(t.Start).getTime();
      const end = t.End instanceof Date ? t.End.getTime() : new Date(t.End).getTime();
      const hours = (end - start) / (1000 * 60 * 60) - (t.Lunch ?? 0);
      currentHrsByCompany.set(abbr, (currentHrsByCompany.get(abbr) ?? 0) + hours);
    }
    const hrsByCompanyData = buildChartArray(
      ["Company", "Hours Billed"],
      Array.from(currentHrsByCompany.entries()).map(([k, v]) => [k, Math.round(v * 100) / 100])
    );

    return NextResponse.json({
      pastInternsByMajorData,
      internsByMajorData,
      pastInternsByCompanyData,
      internsByCompanyData,
      pastHrsByCompanyData,
      hrsByCompanyData,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
