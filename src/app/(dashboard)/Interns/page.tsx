"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import {
  GET_INTERNS_API,
  type InternListItem,
  type InternsListResponse,
} from "@/lib/api";
import { isBirthdayWeek, formatDobShort } from "@/lib/interns-table";

const SORT_OPTIONS = [
  { value: "", label: "Order By" },
  { value: "lastname", label: "Name" },
  { value: "company", label: "Company" },
  { value: "hours", label: "Hours" },
  { value: "graddate", label: "Grad Date" },
] as const;

/** Simple gift/present icon (red). Uses rects so it always renders. */
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#9E1B32"
      width={20}
      height={20}
      className={className}
      aria-hidden
    >
      {/* Box body */}
      <rect x="4" y="11" width="16" height="9" rx="0" />
      {/* Lid */}
      <rect x="3" y="7" width="18" height="4" rx="0" />
      {/* Vertical ribbon */}
      <rect x="10.5" y="7" width="3" height="13" />
      {/* Horizontal ribbon */}
      <rect x="4" y="13" width="16" height="3" />
      {/* Bow: left and right loops */}
      <ellipse cx="8" cy="6" rx="2.5" ry="2" />
      <ellipse cx="16" cy="6" rx="2.5" ry="2" />
    </svg>
  );
}

function GiftCell({ item }: { item: InternListItem }) {
  const show = isBirthdayWeek(item.dob);
  if (!show) {
    return (
      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]" />
    );
  }
  const message = `${item.firstName}'s birthday is ${formatDobShort(item.dob)}`;
  return (
    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
      <Popover placement="right">
        <PopoverTrigger>
          <button
            type="button"
            className="cursor-pointer bg-transparent border-none p-0 inline-flex items-center justify-center text-[#9E1B32] hover:opacity-80"
            aria-label="Birthday"
          >
            <GiftIcon className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#e8e8e8] border border-[#ccc] rounded-[10px] shadow-lg">
          <div className="text-[#333] font-roboto text-sm flex items-center gap-2" style={{ padding: "16px 22px" }}>
            <span className="inline-flex shrink-0 text-[#9E1B32]" aria-hidden>
              <GiftIcon className="size-5" />
            </span>
            <span>{message}</span>
          </div>
        </PopoverContent>
      </Popover>
    </td>
  );
}

/** Hours-this-week box: 110×22px track, crimson border. Under 5h: black text centered in full box; 5h+: white text in red fill. Two decimal places. */
function HoursBar({
  hours,
  isSummer,
}: {
  hours: number;
  isSummer: boolean;
}) {
  const cap = isSummer ? 40 : 20;
  const pct = hours >= cap ? 100 : Math.min(100, (hours / cap) * 100);
  const underFive = hours > 0 && hours < 5;
  const display = hours.toFixed(2);
  return (
    <div
      className="weekly-hours-bar relative overflow-hidden"
      style={{
        width: 110,
        height: 22,
        border: "1px solid #990000",
        borderRadius: 3,
      }}
    >
      {hours > 0 && (
        <div
          className="weekly-hours-fill flex h-full min-w-0 items-center justify-center bg-[#990000] text-xs font-medium"
          style={{
            width: `${pct}%`,
            color: "white",
          }}
        >
          {!underFive && display}
        </div>
      )}
      {hours > 0 && underFive && (
        <div
          className="pointer-events-none text-xs font-medium text-black"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
          aria-hidden
        >
          {display}
        </div>
      )}
    </div>
  );
}

export default function InternsPage() {
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") ?? "";
  const [data, setData] = useState<InternsListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await GET_INTERNS_API(
      sortby && SORT_OPTIONS.some((o) => o.value === sortby) ? sortby : undefined
    );
    setLoading(false);
    if (result.ok) {
      setData(result.data);
    } else {
      setError(result.error);
    }
  }, [sortby]);

  useEffect(() => {
    load();
  }, [load]);

  const onOrderChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sortby", value);
    else params.delete("sortby");
    window.location.search = params.toString();
  };

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: "normal", color: "#900" }}
          >
            Current Interns
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <select
            value={sortby}
            onChange={(e) => onOrderChange(e.target.value)}
            className="pl-[12px] pr-[32px] py-[8px] border border-[#333] rounded-[6px] text-[#333] bg-white text-[14px] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{
              minWidth: "160px",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 12px center",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value || "default"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div
          className="overflow-x-auto"
          style={{ marginTop: "20px", marginBottom: "48px" }}
        >
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center w-[40px]">
                  <span className="inline-flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    >
                      <rect x="2.5" y="5" width="11" height="8.5" rx="0.75" />
                      <path d="M2.5 7.5h11" />
                      <path d="M8 5v8.5" />
                      <path d="M4.5 4c-.8-.65-.7-1.9.3-2.3.6-.3 1.4-.1 1.8.4.4.5.4 1.2.1 1.7" />
                      <path d="M11.5 4c.8-.65.7-1.9-.3-2.3-.6-.3-1.4-.1-1.8.4-.4.5-.4 1.2-.1 1.7" />
                    </svg>
                  </span>
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  CWID
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Name
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Email
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Phone
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Company
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Semester
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Level
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Grad&nbsp;Date
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Hours&nbsp;This&nbsp;Week
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center w-[40px]">
                  ⚑
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  $
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Actions
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  To&nbsp;Applicant
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Archive&nbsp;Intern
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td
                    colSpan={15}
                    className="border border-[#ddd] p-[10px] text-center text-[#666]"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && data?.interns.length === 0 && (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td
                    colSpan={15}
                    className="border border-[#ddd] p-[10px] text-center text-[#666]"
                  >
                    No interns found.
                  </td>
                </tr>
              )}
              {!loading &&
                data?.interns.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white hover:bg-[#f5f5f5]"
                  >
                    <GiftCell item={item} />
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.cwid ?? "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      <span
                        className={
                          item.nameStyle === "text-bold"
                            ? "font-bold text-[#666]"
                            : "font-normal text-[#666]"
                        }
                      >
                        {item.lastName}, {item.firstName}
                      </span>
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.email ?? "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.phone ?? "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      <span
                        className={
                          item.companyStyle === "text-bold"
                            ? "font-bold text-[#666]"
                            : "font-normal text-[#666]"
                        }
                      >
                        {item.companyName || "—"}
                      </span>
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.semester || "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.level ?? "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.gradDate || "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      <div className="flex justify-center">
                        <HoursBar
                          hours={item.hoursBar}
                          isSummer={data?.isSummer ?? false}
                        />
                      </div>
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {(data?.isSummer && item.hoursThisWeek > 40) ||
                      (!data?.isSummer && item.hoursThisWeek > 20) ? (
                        <span className="text-amber-600" title="Over weekly cap">
                          ⚑
                        </span>
                      ) : null}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      {item.wage != null && item.wage !== 0
                        ? String(item.wage)
                        : "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                      <Link
                        href={`/Interns/Details/${item.id}`}
                        className="text-[#666] text-sm no-underline hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666] !bg-white">
                      <button
                        type="button"
                        className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-white focus:!bg-white focus:outline-none focus:ring-0 active:!bg-white opacity-50 cursor-not-allowed"
                        style={{
                          width: "48px",
                          minWidth: "48px",
                        }}
                        disabled
                        aria-label="Download to applicant (not implemented)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#444444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v10" />
                          <path d="M8 11l4 4 4-4" />
                          <path d="M5 19h14" />
                        </svg>
                      </button>
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666] !bg-white">
                      <button
                        type="button"
                        className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-white focus:!bg-white focus:outline-none focus:ring-0 active:!bg-white opacity-50 cursor-not-allowed"
                        style={{
                          width: "48px",
                          minWidth: "48px",
                        }}
                        disabled
                        aria-label="Archive intern (not implemented)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#444444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v10" />
                          <path d="M8 11l4 4 4-4" />
                          <path d="M5 19h14" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-wrap"
          style={{ marginTop: "32px", gap: "24px" }}
        >
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
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
            <span>Export ATN Report</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
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
            <span>Semester Timelogs</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
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
            <span>Tara Timelogs</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
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
                <path d="M12 3 3 20h18L12 3z" />
                <path d="M12 9v5" />
                <path d="M12 17.5h.01" />
              </svg>
            </span>
            <span>Interns Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
