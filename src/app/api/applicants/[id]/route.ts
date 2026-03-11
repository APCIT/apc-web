import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const EDIT_ROLES = ["admin", "IT", "staff"];
/** Delete: admin and IT only. */
const DELETE_ROLES = ["admin", "IT"];

async function requireEditAccess(): Promise<
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
  if (!EDIT_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

async function requireDeleteAccess(): Promise<
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
  if (!DELETE_ROLES.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US");
}

function formatGradDate(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** GET: single applicant for Edit form. Returns editable + display-only fields. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireEditAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const a = await prisma.applicants.findUnique({
      where: { Id: id },
    });

    if (!a) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: a.Id,
      // Editable
      firstName: a.FirstName ?? "",
      lastName: a.LastName ?? "",
      email: a.Email ?? "",
      school: a.School ?? "",
      major: a.Major ?? "",
      minor: a.Minor ?? "",
      comment: a.Comment ?? "",
      note: a.Note ?? "",
      interviewStatus: a.InterviewStatus,
      callBack: a.CallBack,
      callBackDate: a.CallBackDate.toISOString(),
      validEmp: a.ValidEmp ?? false,
      prevIntern: a.PrevIntern,
      // Display-only (for showing on form)
      dateApplied: formatShortDate(a.DateApplied),
      phone: a.Phone ?? "",
      street: a.Street ?? "",
      apt: a.Apt ?? "",
      city: a.City ?? "",
      state: a.State ?? "",
      zip: a.Zip ?? "",
      foreignLanguage: a.ForeignLanguage ?? "",
      birmingham: a.Birmingham,
      huntsville: a.Huntsville,
      mobile: a.Mobile,
      montgomery: a.Montgomery,
      tuscaloosa: a.Tuscaloosa,
      semester: a.Semester ?? "",
      level: a.Level ?? "",
      gradDate: formatGradDate(a.GradDate),
      contactName: a.ContactName ?? "",
      contactRelationship: a.ContactRelationship ?? "",
      contactPhone: a.ContactPhone ?? "",
      hearAboutUs: a.HearAboutUs ?? "",
      preference: a.Preference ?? "",
      skills: a.Skills ?? "",
      annistonGadsden: a.AnnistonGadsden,
      dothan: a.Dothan,
      blueSprings: a.BlueSprings,
      resumeId: a.ResumeId ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT: update applicant (only editable fields). CallBack true → set CallBackDate to now; false → set to epoch. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireEditAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : null;
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : null;
    const email = typeof body.email === "string" ? body.email.trim() : null;
    const school = typeof body.school === "string" ? body.school.trim() : null;
    const major = typeof body.major === "string" ? body.major.trim() : null;
    const minor = typeof body.minor === "string" ? body.minor.trim() : null;
    const comment = typeof body.comment === "string" ? body.comment.trim() : null;
    const note = typeof body.note === "string" ? body.note.trim() : null;
    const interviewStatus = body.interviewStatus === true;
    const callBack = body.callBack === true;
    const validEmp = body.validEmp === true;
    const prevIntern = body.prevIntern === true;

    const existing = await prisma.applicants.findUnique({ where: { Id: id } });
    if (!existing) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    const callBackDate = callBack ? new Date() : new Date("1900-01-01T00:00:00.000Z");

    await prisma.applicants.update({
      where: { Id: id },
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        School: school,
        Major: major,
        Minor: minor,
        Comment: comment,
        Note: note,
        InterviewStatus: interviewStatus,
        CallBack: callBack,
        CallBackDate: callBackDate,
        ValidEmp: validEmp,
        PrevIntern: prevIntern,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    if ((e as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE: remove applicant permanently (admin, IT only). Resume blob in Azure is not deleted. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await requireDeleteAccess();
    if ("error" in access) return access.error;

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid applicant id" }, { status: 400 });
    }

    const applicant = await prisma.applicants.findUnique({
      where: { Id: id },
    });
    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    await prisma.applicants.delete({
      where: { Id: id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    if ((e as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
