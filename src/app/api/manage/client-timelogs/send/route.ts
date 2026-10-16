import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getClientTimelogConfig,
  getCumulativeRangeEnd,
  getLastCompletedSaturday,
  sendAllActiveClientTimelogEmails,
  sendClientTimelogEmail,
  startOfLocalDay,
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
 * POST: send cumulative timelogs (each intern's start through last Saturday).
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

    const asOf = new Date();
    const config = await getClientTimelogConfig();

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
      const result = await sendClientTimelogEmail({
        clientUserId: oneId,
        sentByUserId: access.userId,
        asOf,
        requireActive: false,
      });
      return NextResponse.json({
        ok: result.ok,
        sent: result.ok ? 1 : 0,
        failed: result.ok ? 0 : 1,
        period: {
          start: startOfLocalDay(getLastCompletedSaturday(asOf)).toISOString(),
          end: getCumulativeRangeEnd(asOf).toISOString(),
          throughSaturday: getLastCompletedSaturday(asOf).toISOString(),
        },
        results: [result],
      });
    }

    if (config.semesterEnded) {
      return NextResponse.json(
        {
          error: `Semester ended${config.semesterEnd ? ` on ${config.semesterEnd.toISOString().slice(0, 10)}` : ""}. Update the semester end date before bulk send.`,
          semesterEnded: true,
        },
        { status: 400 }
      );
    }

    const { sent, failed, results } = await sendAllActiveClientTimelogEmails({
      sentByUserId: access.userId,
      asOf,
    });

    return NextResponse.json({
      ok: failed === 0,
      sent,
      failed,
      period: {
        start: startOfLocalDay(getLastCompletedSaturday(asOf)).toISOString(),
        end: getCumulativeRangeEnd(asOf).toISOString(),
        throughSaturday: getLastCompletedSaturday(asOf).toISOString(),
      },
      results,
    });
  } catch (e) {
    console.error("[client-timelogs send]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
