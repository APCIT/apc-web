"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_PAST_INTERNS_API,
  GET_ME_API,
  DELETE_PAST_INTERN_API,
  getPastInternExportUrl,
  type PastInternItem,
} from "@/lib/api";

const BLOB_BASE = "https://apcstorage.blob.core.windows.net";
const CONTAINER_MID_SEM = "intern-reports";
const CONTAINER_IMPACT_CALC = "checklist-impactcalculator";
const CONTAINER_PRESENTATION = "checklist-presentation";

const DELETE_CONFIRM_MESSAGE = "Are you sure you want to permanently delete this past intern?";

/** Initial accordion section shown until API loads (same as Presentations). */
const INITIAL_SEMESTER_LABEL = `Semester ${new Date().getFullYear()}`;

function DocButton({
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
        className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline"
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
      className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#999] bg-white cursor-not-allowed text-[14px] leading-[1.42857143] font-normal text-center align-middle select-none"
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

export default function PastInternsPage() {
  const [data, setData] = useState<{
    semesters: string[];
    pastInternsGroupedBySemester: PastInternItem[][];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    GET_PAST_INTERNS_API()
      .then((res) => {
        if (res.ok) setData(res.data);
        else setError(res.error);
      })
      .catch(() => setError("Failed to load past interns"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) setRoles(res.roles);
    });
  }, []);

  const semesters = useMemo(() => data?.semesters ?? [], [data]);
  const displaySemesters = useMemo(
    () => (loading ? [INITIAL_SEMESTER_LABEL] : semesters),
    [loading, semesters]
  );
  const grouped = useMemo(() => {
    const map = new Map<string, PastInternItem[]>();
    if (!data) return map;
    data.semesters.forEach((s, i) => {
      map.set(s, data.pastInternsGroupedBySemester[i] ?? []);
    });
    return map;
  }, [data]);

  const isIT = roles.includes("IT");
  const canExportAtn = roles.some((r) => ["admin", "IT", "staff"].includes(r));

  async function handleDelete(p: PastInternItem) {
    if (!window.confirm(DELETE_CONFIRM_MESSAGE)) return;
    const res = await DELETE_PAST_INTERN_API(p.id);
    if (res.ok) load();
    else alert(res.error);
  }

  function getExportUrl(semesterLabel: string): string | null {
    const list = grouped.get(semesterLabel);
    const first = list?.[0];
    if (!first?.semester) return null;
    return getPastInternExportUrl(first.semester);
  }

  const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center";
  const tdClass = "border border-[#ddd] p-[10px] text-center align-middle text-[#666]";

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Past Interns
          </h2>
        </div>

        <div className="manage-accordion px-4 mt-8">
          {error && (
            <p className="font-roboto text-red-600 mb-4">{error}</p>
          )}
          {!loading && semesters.length === 0 && (
            <p className="font-roboto text-[#666]">No past interns yet.</p>
          )}
          {displaySemesters.length > 0 && (
            <Accordion
              disableIndicatorAnimation={false}
              showDivider={false}
              selectionMode="multiple"
              itemClasses={{
                base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
                heading: "m-0 p-0",
                trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
                title: "text-[16px] font-normal text-[#666666] text-left",
                titleWrapper: "flex-1",
                content: "bg-white rounded-lg",
                indicator: "text-black",
              }}
            >
              {displaySemesters.map((semesterLabel) => (
                <AccordionItem
                  key={semesterLabel}
                  aria-label={semesterLabel}
                  title={
                    <span className="!font-bold" style={{ fontWeight: 700 }}>
                      {semesterLabel}
                    </span>
                  }
                  HeadingComponent="div"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <thead>
                        <tr className="bg-[#9E1B32]">
                          <th className={thClass}>Name</th>
                          <th className={thClass}>Company</th>
                          <th className={thClass}>School</th>
                          <th className={thClass}>Mid-Sem Report</th>
                          <th className={thClass}>Impact Calculator</th>
                          <th className={thClass}>Presentation</th>
                          <th className={thClass}>Details</th>
                          <th className={thClass}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && semesterLabel === INITIAL_SEMESTER_LABEL ? (
                          <tr>
                            <td colSpan={8} className={tdClass}>
                              Loading…
                            </td>
                          </tr>
                        ) : (
                          (grouped.get(semesterLabel) ?? []).map((p) => {
                            const midSemHref =
                              p.midSemReportId && p.midSemReportId.length > 15
                                ? `${BLOB_BASE}/${CONTAINER_MID_SEM}/${encodeURIComponent(p.midSemReportId)}`
                                : null;
                            const impactHref =
                              p.impactCalcId && p.impactCalcId.length > 15
                                ? `${BLOB_BASE}/${CONTAINER_IMPACT_CALC}/${encodeURIComponent(p.impactCalcId)}`
                                : null;
                            const presHref =
                              p.presentationId && p.presentationId.length > 15
                                ? `${BLOB_BASE}/${CONTAINER_PRESENTATION}/${encodeURIComponent(p.presentationId)}`
                                : null;
                            const name = [p.lastName, p.firstName].filter(Boolean).join(", ") || "\u2014";
                            return (
                              <tr key={p.id} className="bg-white hover:bg-[#f5f5f5]">
                                <td className={tdClass}>{name}</td>
                                <td className={tdClass}>{p.company || "\u2014"}</td>
                                <td className={tdClass}>{p.school || "\u2014"}</td>
                                <td className={`${tdClass} !bg-white`}>
                                  <DocButton
                                    href={midSemHref}
                                    label="Mid-Sem"
                                    ariaLabel="Mid-Sem Report"
                                  />
                                </td>
                                <td className={`${tdClass} !bg-white`}>
                                  <DocButton
                                    href={impactHref}
                                    label="Imp-Cal"
                                    ariaLabel="Impact Calculator"
                                  />
                                </td>
                                <td className={`${tdClass} !bg-white`}>
                                  <DocButton
                                    href={presHref}
                                    label="Pres"
                                    ariaLabel="Presentation"
                                  />
                                </td>
                                <td className={tdClass}>
                                  <Link
                                    href={`/PastInterns/Details/${p.id}`}
                                    className="text-[#666] no-underline hover:underline text-sm"
                                  >
                                    Details
                                  </Link>
                                </td>
                                <td className={`${tdClass} !bg-white`}>
                                  {isIT ? (
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(p)}
                                      className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-gray-100 text-[#333333] text-[16px] leading-none w-[48px] min-w-[48px] cursor-pointer"
                                      aria-label="Delete"
                                    >
                                      ×
                                    </button>
                                  ) : (
                                    <span className="text-[#999]">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!loading && semesterLabel !== INITIAL_SEMESTER_LABEL && canExportAtn && getExportUrl(semesterLabel) && (
                    <div className="mt-4 pb-2">
                      <a
                        href={getExportUrl(semesterLabel)!}
                        className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-gray-50 text-[14px] font-normal no-underline"
                        download
                      >
                        Export ATN Report
                      </a>
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
