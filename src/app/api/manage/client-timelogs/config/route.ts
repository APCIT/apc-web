import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientTimelogConfig } from "@/lib/client-timelogs";

const ALLOWED = ["IT", "admin", "staff"];

async function requireAccess() {
  const session = await getSession();
  if (!session?.isLoggedIn || !session.userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.aspNetUsers.findUnique({
    where: { Id: session.userId },
    include: { AspNetUserRoles: { include: { AspNetRoles: true } } },
  });
  const roles = user?.AspNetUserRoles.map((ur) => ur.AspNetRoles.Name) ?? [];
  if (!ALLOWED.some((r) => roles.includes(r))) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const };
}

/** PATCH: update semester label / end date for client timelog emails. */
export async function PATCH(request: Request) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const semesterLabel =
      typeof body.semesterLabel === "string" ? body.semesterLabel.trim() || null : undefined;
    let semesterEnd: Date | null | undefined = undefined;
    if ("semesterEnd" in body) {
      if (body.semesterEnd == null || body.semesterEnd === "") {
        semesterEnd = null;
      } else if (typeof body.semesterEnd === "string") {
        const d = new Date(body.semesterEnd + "T12:00:00");
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json({ error: "Invalid semesterEnd date" }, { status: 400 });
        }
        semesterEnd = d;
      }
    }

    const data: { SemesterLabel?: string | null; SemesterEnd?: Date | null } = {};
    if (semesterLabel !== undefined) data.SemesterLabel = semesterLabel;
    if (semesterEnd !== undefined) data.SemesterEnd = semesterEnd;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    await prisma.clientTimelogConfig.upsert({
      where: { Id: 1 },
      create: {
        Id: 1,
        SemesterLabel: data.SemesterLabel ?? null,
        SemesterEnd: data.SemesterEnd ?? null,
      },
      update: data,
    });

    const config = await getClientTimelogConfig();
    return NextResponse.json({
      ok: true,
      semesterLabel: config.semesterLabel,
      semesterEnd: config.semesterEnd ? config.semesterEnd.toISOString().slice(0, 10) : null,
      semesterEnded: config.semesterEnded,
    });
  } catch (e) {
    console.error("[client-timelogs config]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
