"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  GET_INTERNS_WITHOUT_REPORTS_API,
  API,
  type WithoutReportsResponse,
} from "@/lib/api";

const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center";
const tdClass = "border border-[#ddd] p-[10px] text-center align-middle text-[#666]";

const accordionItemClasses = {
  base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
  heading: "m-0 p-0",
  trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
  title: "text-[16px] font-normal text-[#666666] text-left",
  titleWrapper: "flex-1",
  content: "bg-white rounded-lg",
  indicator: "text-black",
};

export default function InternsReportsPage() {
  const [data, setData] = useState<WithoutReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await GET_INTERNS_WITHOUT_REPORTS_API();
    if (result.ok) {
      setData(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6">
          <Link
            href="/Interns"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            Current Interns
          </Link>
        </div>
        <h2
          className="text-[24px] font-roboto text-center mb-6"
          style={{ fontWeight: "normal", color: "#900" }}
        >
          Interns Without Reports
        </h2>

        {error && (
          <p className="font-roboto text-red-600 mb-4">{error}</p>
        )}

        <div className="manage-accordion">
          {loading ? (
            <p className="font-roboto text-[#666]">Loading…</p>
          ) : data && data.reportTypes.length > 0 ? (
            <Accordion
              disableIndicatorAnimation={false}
              showDivider={false}
              selectionMode="single"
              itemClasses={accordionItemClasses}
            >
              {data.reportTypes.map((reportType) => {
                const list =
                  reportType === "Impact Calculator"
                    ? data.impactCalcList
                    : data.presentationList;
                return (
                  <AccordionItem
                    key={reportType}
                    aria-label={reportType}
                    title={
                      <span className="font-bold" style={{ color: "#900" }}>
                        {reportType}
                      </span>
                    }
                    HeadingComponent="div"
                  >
                    <div className="overflow-x-auto">
                      <table
                        className="w-full border-collapse font-roboto text-sm table-fixed"
                        style={{ tableLayout: "fixed" }}
                      >
                        <thead>
                          <tr className="bg-[#9E1B32]">
                            <th className={thClass}>Name</th>
                            <th className={thClass}>Company</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.length === 0 ? (
                            <tr>
                              <td colSpan={2} className={tdClass}>
                                No interns missing this report.
                              </td>
                            </tr>
                          ) : (
                            list.map((item, idx) => {
                              const name = [item.lastName, item.firstName]
                                .filter(Boolean)
                                .join(", ") || "—";
                              return (
                                <tr
                                  key={`${reportType}-${idx}-${item.lastName}-${item.firstName}`}
                                  className="bg-white hover:bg-[#f5f5f5]"
                                >
                                  <td className={tdClass}>{name}</td>
                                  <td className={tdClass}>{item.companyName || "—"}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            !loading && (
              <p className="font-roboto text-[#666]">No report types configured.</p>
            )
          )}
        </div>

        {!loading && data && (
          <div className="mt-8">
            <a
              href={API.archiveExportInternsWithoutReports}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
              style={{ textDecoration: "none" }}
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
              <span>Interns Reports</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
