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

/** GET: single service by id (for Details page). Returns 404 if not found. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = parseInt(idParam ?? "", 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
    }

    const row = await prisma.services.findUnique({
      where: { Id: id },
      select: {
        Id: true,
        Company_Id: true,
        TypeOfService: true,
        StaffMember: true,
        StartDate: true,
        EndDate: true,
        Completed: true,
        Certificate: true,
        County: true,
        NumberEmployeesTrained: true,
        FieldStaff: true,
        NumberInterns: true,
        Companies: {
          select: { Name: true },
        },
      },
    });

    if (!row) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = {
      id: row.Id,
      companyId: row.Company_Id ?? null,
      typeOfService: row.TypeOfService ?? "",
      companyName: row.Companies?.Name ?? "",
      staffMember: row.StaffMember ?? "",
      fieldStaff: row.FieldStaff,
      county: row.County ?? "",
      numberEmployeesTrained: row.NumberEmployeesTrained,
      certificate: row.Certificate,
      numberInterns: row.NumberInterns,
      startDate: row.StartDate.toISOString(),
      endDate: row.EndDate.toISOString(),
      completed: row.Completed,
    };

    return NextResponse.json(service);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Compute Season string from a Date: month 0-4 = Spring, 5-6 = Summer, 7-11 = Fall. */
function getSeasonFromDate(d: Date): string {
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();
  if (month <= 4) return `Spring ${year}`;
  if (month <= 6) return `Summer ${year}`;
  return `Fall ${year}`;
}

/** PUT: update service by id. Body: typeOfService, staffMember, fieldStaff, county, numberEmployeesTrained, numberInterns, companyId, completed, certificate, startDateMonth (1-12), semesterYear, endDateMonth (1-12), semesterYearEnd. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = parseInt(idParam ?? "", 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const typeOfService = typeof body.typeOfService === "string" ? body.typeOfService.trim() : "";
    const staffMember = typeof body.staffMember === "string" ? body.staffMember.trim() : "";
    const county = typeof body.county === "string" ? body.county.trim() : "";
    const fieldStaff = typeof body.fieldStaff === "number" ? body.fieldStaff : Number(body.fieldStaff);
    const numberEmployeesTrained = typeof body.numberEmployeesTrained === "number" ? body.numberEmployeesTrained : Number(body.numberEmployeesTrained);
    const numberInterns = typeof body.numberInterns === "number" ? body.numberInterns : Number(body.numberInterns);
    const companyIdRaw = body.companyId;
    const companyId = typeof companyIdRaw === "number" ? companyIdRaw : typeof companyIdRaw === "string" ? parseInt(companyIdRaw, 10) : NaN;
    const completed = body.completed === true || body.completed === "true";
    const certificate = body.certificate === true || body.certificate === "true";
    const startDateMonth = typeof body.startDateMonth === "number" ? body.startDateMonth : parseInt(String(body.startDateMonth ?? ""), 10);
    const semesterYear = parseInt(String(body.semesterYear ?? ""), 10);
    const endDateMonth = typeof body.endDateMonth === "number" ? body.endDateMonth : parseInt(String(body.endDateMonth ?? ""), 10);
    const semesterYearEnd = parseInt(String(body.semesterYearEnd ?? ""), 10);

    if (!typeOfService) {
      return NextResponse.json({ error: "Type of Service is required." }, { status: 400 });
    }
    if (!staffMember) {
      return NextResponse.json({ error: "Staff Member is required." }, { status: 400 });
    }
    if (!county) {
      return NextResponse.json({ error: "County is required." }, { status: 400 });
    }
    if (!Number.isInteger(companyId) || companyId <= 0) {
      return NextResponse.json({ error: "Company is required." }, { status: 400 });
    }
    if (!Number.isInteger(startDateMonth) || startDateMonth < 1 || startDateMonth > 12 || !Number.isInteger(semesterYear) || semesterYear < 2000 || semesterYear > 2100) {
      return NextResponse.json({ error: "Start Date (month and year) is required." }, { status: 400 });
    }
    if (!Number.isInteger(endDateMonth) || endDateMonth < 1 || endDateMonth > 12 || !Number.isInteger(semesterYearEnd) || semesterYearEnd < 2000 || semesterYearEnd > 2100) {
      return NextResponse.json({ error: "End Date (month and year) is required." }, { status: 400 });
    }

    const existing = await prisma.services.findUnique({ where: { Id: id } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const startDate = new Date(Date.UTC(semesterYear, startDateMonth - 1, 1));
    const endDate = new Date(Date.UTC(semesterYearEnd, endDateMonth - 1, 1));
    const season = getSeasonFromDate(startDate);

    await prisma.services.update({
      where: { Id: id },
      data: {
        TypeOfService: typeOfService,
        StaffMember: staffMember,
        County: county,
        FieldStaff: Number.isFinite(fieldStaff) ? fieldStaff : 0,
        NumberEmployeesTrained: Number.isFinite(numberEmployeesTrained) ? numberEmployeesTrained : 0,
        NumberInterns: Number.isFinite(numberInterns) ? numberInterns : 0,
        Company_Id: companyId,
        Completed: completed,
        Certificate: certificate,
        StartDate: startDate,
        EndDate: endDate,
        Season: season,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE: remove service by id. Returns 404 if not found. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireServicesAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = parseInt(idParam ?? "", 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
    }

    const existing = await prisma.services.findUnique({ where: { Id: id } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await prisma.services.delete({ where: { Id: id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
