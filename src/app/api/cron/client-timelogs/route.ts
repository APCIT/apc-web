import { NextResponse } from "next/server";
import {
  getClientTimelogConfig,
  getCumulativeRangeEnd,
  getLastCompletedSaturday,
  isMondayInOrgTz,
  sendAllActiveClientTimelogEmails,
  startOfLocalDay,
} from "@/lib/client-timelogs";

/**
 * Monday auto-send: cumulative timelogs (intern start → last Saturday).
 *
 * Auth: Authorization: Bearer <CRON_SECRET> only (do not put the secret in the URL).
 * Optional: ?force=1 to run on a non-Monday (testing).
 *
 * Schedule externally (Azure Logic App, Task Scheduler, etc.) for Mondays
 * morning America/Chicago, e.g. 8:00 AM.
 */
export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) {
      return NextResponse.json(
        { error: "CRON_SECRET is not configured" },
        { status: 503 }
      );
    }

    const url = new URL(request.url);
    const auth = request.headers.get("authorization") ?? "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (bearer !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const force = url.searchParams.get("force") === "1";
    const asOf = new Date();

    if (!force && !isMondayInOrgTz(asOf)) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Not Monday in America/Chicago — weekly client send runs on Mondays only",
        throughSaturday: getLastCompletedSaturday(asOf).toISOString(),
      });
    }

    const config = await getClientTimelogConfig();
    if (config.semesterEnded) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: `Semester ended${config.semesterEnd ? ` on ${config.semesterEnd.toISOString().slice(0, 10)}` : ""} — auto-send paused`,
        semesterEnded: true,
      });
    }

    const { sent, failed, results } = await sendAllActiveClientTimelogEmails({
      sentByUserId: null,
      asOf,
    });

    return NextResponse.json({
      ok: failed === 0,
      skipped: false,
      sent,
      failed,
      period: {
        throughSaturday: getLastCompletedSaturday(asOf).toISOString(),
        endExclusive: getCumulativeRangeEnd(asOf).toISOString(),
        displayStart: startOfLocalDay(getLastCompletedSaturday(asOf)).toISOString(),
      },
      results,
    });
  } catch (e) {
    console.error("[cron client-timelogs]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
