"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_WORK_SCHEDULES_API,
  getInternSchedulesExportUrl,
  type WorkScheduleDisplayItem,
} from "@/lib/api";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function ScheduleRow({ row }: { row: WorkScheduleDisplayItem }) {
  const name = [row.lastName, row.firstName].filter(Boolean).join(", ") || "—";
  const startLine2 = row.start2Display ?? null;
  const endLine2 = row.end2Display ?? null;

  return (
    <tr className="bg-white hover:bg-[#f5f5f5]">
      <td className="border border-[#ddd] p-[10px] text-[#666] text-center">{name}</td>
      <td className="border border-[#ddd] p-[10px] text-[#666] text-center">{row.companyName || "—"}</td>
      <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
        <div>{row.startDisplay}</div>
        {startLine2 && <div className="text-[#888]">{startLine2}</div>}
      </td>
      <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
        <div>{row.endDisplay}</div>
        {endLine2 && <div className="text-[#888]">{endLine2}</div>}
      </td>
    </tr>
  );
}

export default function ScheduleDisplayPage() {
  const [data, setData] = useState<{
    daysOfWeek: string[];
    workSchedules: WorkScheduleDisplayItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    GET_WORK_SCHEDULES_API()
      .then((res) => {
        if (res.ok) setData(res.data);
        else setError(res.error);
      })
      .catch(() => setError("Failed to load work schedules"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const schedulesByDay = useMemo(() => {
    const dayToNum: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const map = new Map<string, WorkScheduleDisplayItem[]>();
    for (const day of DAY_ORDER) {
      map.set(day, []);
    }
    if (!data?.workSchedules) return map;
    const numToDay = Object.fromEntries(
      Object.entries(dayToNum).map(([k, v]) => [v, k])
    );
    for (const row of data.workSchedules) {
      const dayName = numToDay[row.dayOfWeek];
      if (dayName && map.has(dayName)) {
        map.get(dayName)!.push(row);
      }
    }
    return map;
  }, [data?.workSchedules]);

  const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center";

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Work Schedules
          </h2>
        </div>

        <div className="manage-accordion px-4 mt-8">
          {error && (
            <p className="font-roboto text-red-600 mb-4">{error}</p>
          )}
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
              {DAY_ORDER.map((day) => (
                <AccordionItem
                  key={day}
                  aria-label={day}
                  title={
                    <span className="!font-bold" style={{ fontWeight: 700 }}>
                      {day}
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
                          <th className={thClass}>Start Time</th>
                          <th className={thClass}>End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="border border-[#ddd] p-[10px] text-[#666] text-center">
                              Loading…
                            </td>
                          </tr>
                        ) : (schedulesByDay.get(day) ?? []).length === 0 ? (
                          <tr className="bg-white hover:bg-[#f5f5f5]">
                            <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                            <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                            <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                            <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                          </tr>
                        ) : (
                          (schedulesByDay.get(day) ?? []).map((row) => (
                            <ScheduleRow key={row.id} row={row} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
        </div>

        <div className="flex flex-wrap" style={{ gap: "24px", marginTop: "32px" }}>
          <Link
            href={getInternSchedulesExportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline"
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
            <span>Semester Schedules</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
