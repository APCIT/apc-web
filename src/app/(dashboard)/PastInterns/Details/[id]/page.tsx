"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GET_PAST_INTERN_BY_ID_API, type PastInternDetailItem } from "@/lib/api";

const BLOB_BASE = "https://apcstorage.blob.core.windows.net";
const CONTAINER_MID_SEM = "intern-reports";
const CONTAINER_IMPACT_CALC = "checklist-impactcalculator";
const CONTAINER_PRESENTATION = "checklist-presentation";

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Grad Date as "December yyyy" / "May yyyy" / "August yyyy". */
function formatGradDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "\u2014";
    const month = MONTHS[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${month} ${year}`;
  } catch {
    return "\u2014";
  }
}

function DocCell({
  href,
  label,
  ariaLabel,
}: {
  href: string | null;
  label: string;
  ariaLabel: string;
}) {
  const isLink = href && href.length > 15;
  if (isLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] font-normal no-underline"
        aria-label={ariaLabel}
      >
        <DocIcon />
        <span className="ml-2">{label}</span>
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#999] bg-white cursor-not-allowed text-[14px] font-normal"
      aria-label={ariaLabel}
    >
      <DocIcon />
      <span className="ml-2">{label}</span>
    </button>
  );
}

function DocIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function TableRow({
  label,
  value,
  skeleton,
}: {
  label: string;
  value: React.ReactNode;
  skeleton?: boolean;
}) {
  return (
    <tr className="font-roboto text-[14px]">
      <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
        {label}
      </th>
      <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
        {skeleton ? (
          <span className="inline-block h-4 min-w-[80px] max-w-[200px] bg-[#e5e5e5] rounded animate-pulse" />
        ) : (
          value ?? "\u2014"
        )}
      </td>
    </tr>
  );
}

export default function PastInternDetailsPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : "";
  const id = parseInt(idParam, 10);

  const [pastIntern, setPastIntern] = useState<PastInternDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setLoading(false);
      setError("Invalid past intern id");
      return;
    }
    let cancelled = false;
    GET_PAST_INTERN_BY_ID_API(id)
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setPastIntern(res.pastIntern);
        else {
          setError(res.status === 404 ? "Past intern not found" : res.error);
          if (res.status === 404) setPastIntern(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load past intern");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">Invalid past intern.</p>
          <Link href="/PastInterns" className={backButtonClass + " mt-4 inline-block"}>
            Back to Past Interns
          </Link>
        </div>
      </div>
    );
  }

  if (error && !pastIntern) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">{error}</p>
          <Link href="/PastInterns" className={backButtonClass + " mt-4 inline-block"}>
            Back to Past Interns
          </Link>
        </div>
      </div>
    );
  }

  const p = pastIntern;
  const showSkeleton = loading;
  const title = p ? `${p.firstName} ${p.lastName}`.trim() || "Past Intern" : "Past Intern";
  const address = p ? [p.street, p.apt, p.city, p.state, p.zip].filter(Boolean).join(", ") : "";

  const midSemHref =
    p?.midSemReportId && p.midSemReportId.length > 15
      ? `${BLOB_BASE}/${CONTAINER_MID_SEM}/${encodeURIComponent(p.midSemReportId)}`
      : null;
  const impactHref =
    p?.impactCalcId && p.impactCalcId.length > 15
      ? `${BLOB_BASE}/${CONTAINER_IMPACT_CALC}/${encodeURIComponent(p.impactCalcId)}`
      : null;
  const presHref =
    p?.presentationId && p.presentationId.length > 15
      ? `${BLOB_BASE}/${CONTAINER_PRESENTATION}/${encodeURIComponent(p.presentationId)}`
      : null;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/PastInterns" className={backButtonClass + " shrink-0"}>
            Back to Past Interns
          </Link>
          <h2
            className="font-roboto flex-1 text-center"
            style={{ fontSize: "30px", fontWeight: "normal", color: "#000000" }}
          >
            {showSkeleton ? "Past Intern" : `${title} - Past Intern`}
          </h2>
          <span className="w-[140px] shrink-0" aria-hidden />
        </div>

        <div className="max-w-3xl">
          <table className="w-full border-collapse font-roboto text-sm">
            <tbody>
              <TableRow label="First Name" value={p?.firstName} skeleton={showSkeleton} />
              <TableRow label="Last Name" value={p?.lastName} skeleton={showSkeleton} />
              <TableRow label="Address" value={address || undefined} skeleton={showSkeleton} />
              <TableRow label="E-Mail" value={p?.email} skeleton={showSkeleton} />
              <TableRow label="Phone" value={p?.phone} skeleton={showSkeleton} />
              <TableRow
                label="Grad Date"
                value={p ? formatGradDate(p.gradDate) : undefined}
                skeleton={showSkeleton}
              />
              <TableRow label="CWID" value={p?.cwid} skeleton={showSkeleton} />
              <TableRow label="Major" value={p?.major} skeleton={showSkeleton} />
              <TableRow label="Semester" value={p?.semesterLabel} skeleton={showSkeleton} />
              <TableRow label="Company" value={p?.company} skeleton={showSkeleton} />
              <TableRow label="School" value={p?.school} skeleton={showSkeleton} />
              <TableRow label="Wage" value={p != null ? String(p.wage) : undefined} skeleton={showSkeleton} />
              <TableRow label="Mentor Name" value={p?.mentorName} skeleton={showSkeleton} />
              <TableRow label="Mentor Title" value={p?.mentorTitle} skeleton={showSkeleton} />
              <TableRow label="Mentor Phone" value={p?.mentorPhone} skeleton={showSkeleton} />
              <TableRow label="Mentor E-Mail" value={p?.mentorEmail} skeleton={showSkeleton} />
              <TableRow label="Note" value={p?.note} skeleton={showSkeleton} />
              <TableRow label="Hours Worked" value={p != null ? String(p.hrsWorked) : undefined} skeleton={showSkeleton} />
              <tr className="font-roboto text-[14px]">
                <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                  Mid Sem Report
                </th>
                <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                  {showSkeleton ? (
                    <span className="inline-block h-8 w-24 bg-[#e5e5e5] rounded animate-pulse" />
                  ) : (
                    <DocCell href={midSemHref} label="Mid-Sem" ariaLabel="Mid Sem Report" />
                  )}
                </td>
              </tr>
              <tr className="font-roboto text-[14px]">
                <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                  Impact Calculator
                </th>
                <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                  {showSkeleton ? (
                    <span className="inline-block h-8 w-24 bg-[#e5e5e5] rounded animate-pulse" />
                  ) : (
                    <DocCell href={impactHref} label="Imp-Cal" ariaLabel="Impact Calculator" />
                  )}
                </td>
              </tr>
              <tr className="font-roboto text-[14px]">
                <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                  Presentation
                </th>
                <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                  {showSkeleton ? (
                    <span className="inline-block h-8 w-24 bg-[#e5e5e5] rounded animate-pulse" />
                  ) : (
                    <DocCell href={presHref} label="Pres" ariaLabel="Presentation" />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
