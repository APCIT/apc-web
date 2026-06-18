import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const STAFF_ROLES = ["admin", "IT", "staff", "reception"];

const money = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

const wholeNumber = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isInteger(n) && n >= 0 ? n : null;
};

async function requireAccessForInternId(
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

  if (roles.includes("intern") && session.userId === internId) {
    return { ok: true };
  }

  if (STAFF_ROLES.some((r) => roles.includes(r))) {
    return { ok: true };
  }

  return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const access = await requireAccessForInternId(id);
    if ("error" in access) return access.error;

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const ImpactTotals = await prisma.impactTotals.findUnique({
      where: { InternId: id },
    });

    return NextResponse.json({
      increasedSales: ImpactTotals?.IncreasedSales ?? "",
      retainedSales: ImpactTotals?.RetainedSales ?? "",
      jobsCreated: ImpactTotals?.JobsCreated ?? "",
      numberJobsCreated: ImpactTotals?.NumberJobsCreated ?? "",
      jobsRetained: ImpactTotals?.JobsRetained ?? "",
      numberJobsRetained: ImpactTotals?.NumberJobsRetained ?? "",
      costAvoidanceGovtFines: ImpactTotals?.CostAvoidanceGovtFines ?? "",
      timeCostReduction: ImpactTotals?.TimeCostReduction ?? "",
      investments: ImpactTotals?.Investments ?? "",
      avoidedInvestments: ImpactTotals?.AvoidedInvestments ?? "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id?.trim()) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const access = await requireAccessForInternId(id);
    if ("error" in access) return access.error;

    const intern = await prisma.interns.findUnique({
      where: { Id: id },
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    await prisma.impactTotals.upsert({
      where: { InternId: id },
      create: {
        InternId: id,
        IncreasedSales: money(body.increasedSales),
        RetainedSales: money(body.retainedSales),
        JobsCreated: money(body.jobsCreated),
        NumberJobsCreated: wholeNumber(body.numberJobsCreated),
        JobsRetained: money(body.jobsRetained),
        NumberJobsRetained: wholeNumber(body.numberJobsRetained),
        CostAvoidanceGovtFines: money(body.costAvoidanceGovtFines),
        TimeCostReduction: money(body.timeCostReduction),
        Investments: money(body.investments),
        AvoidedInvestments: money(body.avoidedInvestments),
      },
      update: {
        IncreasedSales: money(body.increasedSales),
        RetainedSales: money(body.retainedSales),
        JobsCreated: money(body.jobsCreated),
        NumberJobsCreated: wholeNumber(body.numberJobsCreated),
        JobsRetained: money(body.jobsRetained),
        NumberJobsRetained: wholeNumber(body.numberJobsRetained),
        CostAvoidanceGovtFines: money(body.costAvoidanceGovtFines),
        TimeCostReduction: money(body.timeCostReduction),
        Investments: money(body.investments),
        AvoidedInvestments: money(body.avoidedInvestments),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}