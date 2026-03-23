import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const str = (v: unknown) => (typeof v === "string" ? v.trim() || null : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" ? parseInt(v, 10) : NaN);

/** Build DateTime for DOB (month 1-12, day 1-31, year). Returns null if invalid. */
function buildDob(month: number, day: number, year: number): Date | null {
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  const d = new Date(year, month - 1, day);
  if (d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

/** Build DateTime for GradDate (month 5|8|12, year). Uses first of month. */
function buildGradDate(month: number, year: number): Date | null {
  if (![5, 8, 12].includes(month) || !Number.isInteger(year) || year < 1900 || year > 2100) return null;
  return new Date(year, month - 1, 1);
}

/** PATCH: update intern's own profile (Manage/EditInfo). Allowed only when id === current user (intern). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    if (!id || id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.aspNetUsers.findUnique({
      where: { Id: session.userId },
      include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
    });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const roles = user.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name);
    if (!roles.includes("intern")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const intern = await prisma.interns.findUnique({ where: { Id: id } });
    if (!intern) {
      return NextResponse.json({ error: "Intern record not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    const userData: { FirstName?: string | null; LastName?: string | null; Email?: string | null } = {};
    if ("firstName" in body) userData.FirstName = str(body.firstName);
    if ("lastName" in body) userData.LastName = str(body.lastName);
    if ("email" in body) userData.Email = str(body.email);

    const internData: {
      Street?: string | null;
      Apt?: string | null;
      City?: string | null;
      State?: string | null;
      Zip?: string | null;
      ContactName?: string | null;
      ContactRelationship?: string | null;
      ContactPhone?: string | null;
      Hometown?: string | null;
      Phone?: string | null;
      School?: string | null;
      Major?: string | null;
      Minor?: string | null;
      Level?: string | null;
      Dob?: Date;
      GradDate?: Date;
    } = {};
    if ("street" in body) internData.Street = str(body.street);
    if ("apt" in body) internData.Apt = str(body.apt);
    if ("city" in body) internData.City = str(body.city);
    if ("state" in body) internData.State = str(body.state);
    if ("zip" in body) internData.Zip = str(body.zip);
    if ("contactName" in body) internData.ContactName = str(body.contactName);
    if ("contactRelationship" in body) internData.ContactRelationship = str(body.contactRelationship);
    if ("contactPhone" in body) internData.ContactPhone = str(body.contactPhone);
    if ("hometown" in body) internData.Hometown = str(body.hometown);
    if ("phone" in body) internData.Phone = str(body.phone);
    if ("school" in body) internData.School = str(body.school);
    if ("major" in body) internData.Major = str(body.major);
    if ("minor" in body) internData.Minor = str(body.minor);
    if ("level" in body) internData.Level = str(body.level);

    const dobMonth = num(body.dobMonth);
    const dobDay = num(body.dobDay);
    const dobYear = num(body.dobYear);
    if (!Number.isNaN(dobMonth) && !Number.isNaN(dobDay) && !Number.isNaN(dobYear)) {
      const dob = buildDob(dobMonth, dobDay, dobYear);
      if (dob) internData.Dob = dob;
    }

    const gradMonth = num(body.gradMonth);
    const gradYear = num(body.gradYear);
    if (!Number.isNaN(gradMonth) && !Number.isNaN(gradYear)) {
      const gd = buildGradDate(gradMonth, gradYear);
      if (gd) internData.GradDate = gd;
    }

    if (Object.keys(userData).length > 0) {
      await prisma.aspNetUsers.update({
        where: { Id: id },
        data: userData,
      });
    }
    if (Object.keys(internData).length > 0) {
      await prisma.interns.update({
        where: { Id: id },
        data: internData,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
