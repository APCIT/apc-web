'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GET_SERVICES_API, type ServiceItem } from "@/lib/api";

/** Distinct Season values from services in order of first appearance (list is already StartDate desc). */
function getSeasonsFromServices(services: ServiceItem[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of services) {
    const season = s.season.trim() || "\u2014";
    if (!seen.has(season)) {
      seen.add(season);
      out.push(season);
    }
  }
  return out;
}

/** Group services by season; within each group sort by companyAbbreviation then typeOfService (spec order). */
function groupBySeason(
  services: ServiceItem[],
  seasons: string[]
): Map<string, ServiceItem[]> {
  const map = new Map<string, ServiceItem[]>();
  for (const season of seasons) {
    const filtered = services.filter((s) => (s.season.trim() || "\u2014") === season);
    filtered.sort((a, b) => {
      const c = (a.companyAbbreviation ?? "").localeCompare(b.companyAbbreviation ?? "");
      if (c !== 0) return c;
      return (a.typeOfService ?? "").localeCompare(b.typeOfService ?? "");
    });
    map.set(season, filtered);
  }
  return map;
}

/** Initial accordion section shown until API seasons are loaded. */
const INITIAL_SEASON_LABEL = `Season ${new Date().getFullYear()}`;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GET_SERVICES_API()
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setServices(res.services);
        else setError(res.error);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load services");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const seasons = useMemo(() => getSeasonsFromServices(services), [services]);
  const displaySeasons = useMemo(
    () => (loading ? [INITIAL_SEASON_LABEL] : seasons),
    [loading, seasons]
  );
  const bySeason = useMemo(
    () => groupBySeason(services, displaySeasons),
    [services, displaySeasons]
  );

  async function handleExportServiceLog() {
    setExporting(true);
    try {
      const res = await fetch("/api/services/export", { credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error ?? "Export failed");
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?([^";\n]+)"?/);
      const filename = match ? match[1].trim() : "Services_ByEndDate.xls";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Professional Services
          </h2>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/Services/Create"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-white hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline"
            style={{ backgroundColor: "white" }}
          >
            Create New
          </Link>
          <span style={{ width: "16px" }} />
          <button
            type="button"
            onClick={handleExportServiceLog}
            disabled={exporting}
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-white hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "white" }}
          >
            <span className="inline-flex items-center justify-center mr-[8px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 18a4 4 0 0 1 0-8h.5A5.5 5.5 0 0 1 19 11a3.5 3.5 0 0 1-1 6.9H14" />
                <path d="M12 10v9" />
                <path d="M9.5 15.5 12 18l2.5-2.5" />
              </svg>
            </span>
            <span>{exporting ? "Exporting…" : "Export Service Log"}</span>
          </button>
        </div>

        <div className="manage-accordion px-4 mt-8" style={{ marginTop: "48px" }}>
          {error && (
            <p className="font-roboto text-red-600 mb-4">{error}</p>
          )}
          {!loading && seasons.length === 0 && (
            <p className="font-roboto text-[#666]">No services yet.</p>
          )}
          {displaySeasons.length > 0 && (
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
              {displaySeasons.map((seasonLabel) => (
                <AccordionItem
                  key={seasonLabel}
                  aria-label={seasonLabel}
                  title={
                    <span className="!font-bold" style={{ fontWeight: 700 }}>
                      {seasonLabel}
                    </span>
                  }
                  HeadingComponent="div"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <thead>
                        <tr className="bg-[#9E1B32]">
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Type of Service
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Company
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Staff Member
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Completed?
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Certificate(s) Awarded?
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && seasonLabel === INITIAL_SEASON_LABEL ? (
                          <tr>
                            <td colSpan={6} className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                              Loading…
                            </td>
                          </tr>
                        ) : (
                          <>
                            {(bySeason.get(seasonLabel) ?? []).map((s) => (
                              <tr key={s.id} className="bg-white hover:bg-[#f5f5f5]">
                                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                  {s.typeOfService || "\u2014"}
                                </td>
                                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                  {s.companyAbbreviation || "\u2014"}
                                </td>
                                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                  {s.staffMember || "\u2014"}
                                </td>
                                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                                  <span style={{ color: s.completed ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                                    {s.completed ? "\u2713" : "X"}
                                  </span>
                                </td>
                                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                                  <span style={{ color: s.certificate ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                                    {s.certificate ? "\u2713" : "X"}
                                  </span>
                                </td>
                                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                                  <Link href={`/Services/Edit/${s.id}`} className="text-[#666] no-underline hover:underline text-sm">
                                    Edit
                                  </Link>
                                  <span className="text-[#666] mx-1"> | </span>
                                  <Link href={`/Services/Details/${s.id}`} className="text-[#666] no-underline hover:underline text-sm">
                                    Details
                                  </Link>
                                  <span className="text-[#666] mx-1"> | </span>
                              <Link href={`/Services/Delete/${s.id}`} className="text-[#666] no-underline hover:underline text-sm">
                                Delete
                              </Link>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
