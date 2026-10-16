import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getClientTimelogConfig,
  getPreviousPayPeriod,
  sendClientTimelogEmail,
} from "@/lib/client-timelogs";

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
  return { ok: true as const, userId: session.userId };
}

/**
 * POST: send previous pay-period timelogs.
 * Body: { clientUserId?: string } — one client, or omit to send all active clients.
 */
export async function POST(request: Request) {
  try {
    const access = await requireAccess();
    if ("error" in access) return access.error;

    const body = await request.json().catch(() => ({}));
    const oneId =
      typeof body.clientUserId === "string" ? body.clientUserId.trim() : "";
    const forceAfterSemester = body.forceAfterSemester === true;

    const period = getPreviousPayPeriod();
    const config = await getClientTimelogConfig();
    const results = [];

    if (oneId) {
      if (config.semesterEnded && !forceAfterSemester) {
        return NextResponse.json(
          {
            error: `Semester ended${config.semesterEnd ? ` on ${config.semesterEnd.toISOString().slice(0, 10)}` : ""}. Set a new semester end date, or confirm force send.`,
            semesterEnded: true,
          },
          { status: 400 }
        );
      }
      results.push(
        await sendClientTimelogEmail({
          clientUserId: oneId,
          sentByUserId: access.userId,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
          requireActive: false, // manual single send allowed even if inactive
        })
      );
    } else {
      if (config.semesterEnded) {
        return NextResponse.json(
          {
            error: `Semester ended${config.semesterEnd ? ` on ${config.semesterEnd.toISOString().slice(0, 10)}` : ""}. Update the semester end date before bulk send.`,
            semesterEnded: true,
          },
          { status: 400 }
        );
      }
      const clientRole = await prisma.aspNetRoles.findFirst({
        where: { Name: "client" },
      });
      if (!clientRole) {
        return NextResponse.json({ error: "Client role not found" }, { status: 500 });
      }
      const clients = await prisma.aspNetUsers.findMany({
        where: { AspNetUserRoles: { some: { RoleId: clientRole.Id } } },
        select: { Id: true },
      });
      for (const c of clients) {
        results.push(
          await sendClientTimelogEmail({
            clientUserId: c.Id,
            sentByUserId: access.userId,
            periodStart: period.periodStart,
            periodEnd: period.periodEnd,
            requireActive: true,
          })
        );
      }
    }

    const sent = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    return NextResponse.json({
      ok: failed === 0,
      sent,
      failed,
      period: {
        start: period.periodStart.toISOString(),
        end: period.periodEnd.toISOString(),
      },
      results,
    });
  } catch (e) {
    console.error("[client-timelogs send]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
