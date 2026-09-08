import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Nudges an intern who has uploaded an impact calculator but never confirmed
 * the totals it produced. Shown across the dashboard because interns rarely
 * revisit the Impact Totals page on their own, and staff cannot report on
 * figures that were never confirmed.
 */
export default async function ImpactTotalsBanner({
  userId,
  roles,
  pathname,
}: {
  userId: string;
  roles: string[];
  pathname: string;
}) {
  if (!roles.includes("intern")) return null;

  // Pointless on the page that resolves it.
  if (pathname.startsWith("/Manage/ImpactTotals")) return null;

  const intern = await prisma.interns.findUnique({
    where: { Id: userId },
    select: { ImpactCalcId: true, ImpactTotals: { select: { Id: true } } },
  });

  if (!intern) return null;

  const hasCalculator = (intern.ImpactCalcId?.trim().length ?? 0) > 15;
  if (!hasCalculator || intern.ImpactTotals) return null;

  return (
    <div className="border-b border-[#e0d4a8] bg-[#fdf8e8] px-[50px] py-3">
      <p className="text-[#6b5a1f] font-roboto text-sm">
        You have uploaded an impact calculator but have not confirmed your impact
        totals yet.{" "}
        <Link href="/Manage/ImpactTotals" className="underline font-medium">
          Check and save your totals
        </Link>
        .
      </p>
    </div>
  );
}
