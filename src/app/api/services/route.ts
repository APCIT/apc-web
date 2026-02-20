import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SERVICES_ROLES = ["IT", "admin", "staff", "reception"];

async function requireServicesAccess(): Promise<
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
  if (!SERVICES_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

/** Season from StartDate: month 0-4 = Spring, 5-6 = Summer, 7-11 = Fall (matches Edit). */
function getSeasonFromDate(d: Date): string {
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();
  if (month <= 4) return `Spring ${year}`;
  if (month <= 6) return `Summer ${year}`;
  return `Fall ${year}`;
}

/** GET: all services (projects) ordered by StartDate desc. Distinct Season values = accordion titles; group by Season for content. */
export async function GET() {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const rows = await prisma.services.findMany({
      orderBy: { StartDate: "desc" },
      select: {
        Id: true,
        TypeOfService: true,
        StaffMember: true,
        StartDate: true,
        Completed: true,
        Certificate: true,
        Season: true,
        Companies: {
          select: { Abbreviation: true },
        },
      },
    });

    const services = rows.map((s) => ({
      id: s.Id,
      typeOfService: s.TypeOfService ?? "",
      companyAbbreviation: s.Companies?.Abbreviation ?? "",
      staffMember: s.StaffMember ?? "",
      startDate: s.StartDate.toISOString(),
      completed: s.Completed,
      certificate: s.Certificate,
      season: s.Season ?? "",
    }));

    return NextResponse.json(services);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST: create a new service. Body: typeOfService, staffMember, fieldStaff, county, numberEmployeesTrained, numberInterns, companyId, startDateMonth (1-12), semesterYear, endDateMonth (1-12), semesterYearEnd. Completed and Certificate are false. */
export async function POST(request: Request) {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const typeOfService = typeof body.typeOfService === "string" ? body.typeOfService.trim() : "";
    const staffMember = typeof body.staffMember === "string" ? body.staffMember.trim() : "";
    const county = typeof body.county === "string" ? body.county.trim() : "";
    const fieldStaff = typeof body.fieldStaff === "number" ? body.fieldStaff : Number(body.fieldStaff);
    const numberEmployeesTrained = typeof body.numberEmployeesTrained === "number" ? body.numberEmployeesTrained : Number(body.numberEmployeesTrained);
    const numberInterns = typeof body.numberInterns === "number" ? body.numberInterns : Number(body.numberInterns);
    const companyIdRaw = body.companyId;
    const companyId = typeof companyIdRaw === "number" ? companyIdRaw : typeof companyIdRaw === "string" ? parseInt(String(companyIdRaw), 10) : NaN;
    const startDateMonth = typeof body.startDateMonth === "number" ? body.startDateMonth : parseInt(String(body.startDateMonth ?? ""), 10);
    const semesterYear = parseInt(String(body.semesterYear ?? ""), 10);
    const endDateMonth = typeof body.endDateMonth === "number" ? body.endDateMonth : parseInt(String(body.endDateMonth ?? ""), 10);
    const semesterYearEnd = parseInt(String(body.semesterYearEnd ?? ""), 10);

    if (typeOfService.length <= 2) {
      return NextResponse.json({ error: "Type of Service is required and must be longer than 2 characters." }, { status: 400 });
    }
    if (staffMember.length <= 2) {
      return NextResponse.json({ error: "Staff Member is required and must be longer than 2 characters." }, { status: 400 });
    }
    if (!county) {
      return NextResponse.json({ error: "County is required." }, { status: 400 });
    }
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: "Company is required." }, { status: 400 });
    }
    const company = await prisma.companies.findUnique({ where: { Id: companyId } });
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 400 });
    }
    if (!Number.isInteger(startDateMonth) || startDateMonth < 1 || startDateMonth > 12 || !Number.isInteger(semesterYear) || semesterYear < 2000 || semesterYear > 2100) {
      return NextResponse.json({ error: "Start Date (month and year) is required." }, { status: 400 });
    }
    if (!Number.isInteger(endDateMonth) || endDateMonth < 1 || endDateMonth > 12 || !Number.isInteger(semesterYearEnd) || semesterYearEnd < 2000 || semesterYearEnd > 2100) {
      return NextResponse.json({ error: "End Date (month and year) is required." }, { status: 400 });
    }

    const startDate = new Date(Date.UTC(semesterYear, startDateMonth - 1, 1));
    const endDate = new Date(Date.UTC(semesterYearEnd, endDateMonth - 1, 1));
    const season = getSeasonFromDate(startDate);

    const created = await prisma.services.create({
      data: {
        TypeOfService: typeOfService,
        StaffMember: staffMember,
        County: county,
        FieldStaff: Number.isFinite(fieldStaff) ? fieldStaff : 0,
        NumberEmployeesTrained: Number.isFinite(numberEmployeesTrained) ? numberEmployeesTrained : 0,
        NumberInterns: Number.isFinite(numberInterns) ? numberInterns : 0,
        Company_Id: companyId,
        Completed: false,
        Certificate: false,
        StartDate: startDate,
        EndDate: endDate,
        Season: season,
      },
    });

    return NextResponse.json({ id: created.Id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
