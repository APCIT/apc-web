"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { GET_APPLICANTS_API, GET_ME_API, DELETE_APPLICANT_API, type ApplicantItem } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "recent", label: "Recent" },
  { value: "symbol", label: "Symbol" },
  { value: "level", label: "Level" },
  { value: "major", label: "Major" },
  { value: "name", label: "Name" },
  { value: "school", label: "School" },
  { value: "graddate", label: "Graduation Date" },
] as const;

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "\u2014" : d.toLocaleDateString();
  } catch {
    return "\u2014";
  }
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatGradDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "\u2014";
    const month = MONTHS_SHORT[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${month} ${year}`;
  } catch {
    return "\u2014";
  }
}

function formatCallBackDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
  } catch {
    return "";
  }
}

/** Symbol (first match wins): 1) Interviewed no callback no note → green check; 2) Callback → phone + hover; 3) Prev intern no callback → gold star; 4) Has note no callback → red asterisk. */
function getSymbol(app: ApplicantItem): { type: "check" | "phone" | "star" | "asterisk" | "none"; callBackDate?: string } {
  if (app.interviewStatus && !app.callBack && !(app.note?.trim())) {
    return { type: "check" };
  }
  if (app.callBack) {
    return { type: "phone", callBackDate: formatCallBackDate(app.callBackDate) };
  }
  if (app.prevIntern) {
    return { type: "star" };
  }
  if (app.note?.trim()) {
    return { type: "asterisk" };
  }
  return { type: "none" };
}

export default function ApplicantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sortBy") ?? "";

  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [returnedSortBy, setReturnedSortBy] = useState<string>("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const canEditApplicant = useMemo(
    () => roles.includes("admin") || roles.includes("IT"),
    [roles]
  );

  const effectiveSort = useMemo(() => {
    const v = sortByParam.toLowerCase().trim();
    if (["symbol", "level", "major", "name", "recent", "school", "graddate"].includes(v)) return v;
    if (v === "graduation date") return "graddate";
    return "recent";
  }, [sortByParam]);

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) setRoles(res.roles);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GET_APPLICANTS_API(effectiveSort === "recent" ? undefined : effectiveSort)
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setApplicants(res.applicants);
          setReturnedSortBy(res.sortBy);
        } else {
          setError(res.error);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load applicants");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveSort]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const url = value && value !== "recent" ? `/Applicants?sortBy=${encodeURIComponent(value)}` : "/Applicants";
      router.push(url);
    },
    [router]
  );

  const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center";
  const tdClass = "border border-[#ddd] p-[10px] text-center align-middle text-[#666]";
  const boldStyle: React.CSSProperties = { fontWeight: "bold" };

  const symbolBold = returnedSortBy === "symbol" ? boldStyle : undefined;
  const dateAppliedBold = returnedSortBy === "recent" ? boldStyle : undefined;
  const nameBold = returnedSortBy === "name" ? boldStyle : undefined;
  const majorBold = returnedSortBy === "major" ? boldStyle : undefined;
  const schoolBold = returnedSortBy === "school" ? boldStyle : undefined;
  const levelBold = returnedSortBy === "level" ? boldStyle : undefined;
  const gradDateBold = returnedSortBy === "graddate" ? boldStyle : undefined;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2 className="text-[24px] font-roboto" style={{ fontWeight: "normal", color: "#900" }}>
            Internship Applicants
          </h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex">
            <Link
              href="/api/applicants/export"
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
              style={{ fontWeight: "normal", textDecoration: "none", marginRight: "20px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ marginRight: "10px" }}
              >
                <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
              </svg>
              Export Applicants
            </Link>
            <Link
              href="/Applicants/Search"
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
              style={{ fontWeight: "normal", textDecoration: "none" }}
            >
              Applicant Search
            </Link>
          </div>

          <select
            value={effectiveSort}
            onChange={handleSortChange}
            className="pl-[12px] pr-[20px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{
              minWidth: "140px",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 10px center",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ height: "20px" }} />

        <div className="overflow-x-auto">
          {error && <p className="font-roboto text-red-600 mb-4">{error}</p>}
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className={`${thClass} w-[40px]`} style={symbolBold}>
                  <Popover placement="right">
                    <PopoverTrigger>
                      <button className="cursor-pointer bg-transparent border-none p-0 text-white hover:opacity-80" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="applicants-legend bg-[#e8e8e8] border border-[#ccc] rounded-[10px] shadow-lg">
                      <div className="text-[#333] font-roboto text-xl" style={{ padding: "16px 22px" }}>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#DAA520] text-[20px]" style={{ fontFamily: "serif" }}>★</span>
                            <span>: Previous Intern</span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#228B22] text-[20px] font-bold">✔</span>
                            <span>: Interviewed</span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#333" strokeWidth="1">
                              <rect x="4" y="1" width="8" height="14" rx="1" ry="1" />
                              <line x1="6" y1="12" x2="10" y2="12" />
                            </svg>
                            <span>: Called Back</span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#DC143C] text-[20px] font-bold">✱</span>
                            <span>: Note</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </th>
                <th className={thClass}>
                  Valid US
                  <br />
                  Employee
                </th>
                <th className={thClass} style={dateAppliedBold}>
                  Date
                  <br />
                  Applied
                </th>
                <th className={thClass} style={nameBold}>Name</th>
                <th className={thClass} style={majorBold}>Major</th>
                <th className={thClass} style={schoolBold}>School</th>
                <th className={thClass} style={levelBold}>Level</th>
                <th className={thClass} style={gradDateBold}>
                  Grad
                  <br />
                  Date
                </th>
                <th className={`${thClass}`} style={{ minWidth: "300px" }}>
                  Skills
                </th>
                <th className={thClass}>
                  Foreign
                  <br />
                  Language
                </th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className={tdClass}>
                    Loading…
                  </td>
                </tr>
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={11} className={tdClass}>
                    No applicants.
                  </td>
                </tr>
              ) : (
                applicants.map((app) => {
                  const symbol = getSymbol(app);
                  const nameDisplay = [app.lastName, app.firstName].filter(Boolean).join(", ") || "\u2014";
                  return (
                    <tr key={app.id} className="bg-white hover:bg-[#f5f5f5]">
                      <td className={tdClass} style={symbolBold}>
                        {symbol.type === "check" && <span className="text-[#228B22] font-bold">✔</span>}
                        {symbol.type === "phone" && (
                          <Popover placement="right">
                            <PopoverTrigger>
                              <button
                                type="button"
                                className="cursor-pointer bg-transparent border-none p-0 inline-flex align-middle text-[#333] hover:opacity-80"
                                aria-label="Called back details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="inline-block">
                                  <rect x="4" y="1" width="8" height="14" rx="1" ry="1" />
                                  <line x1="6" y1="12" x2="10" y2="12" />
                                </svg>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-[#e8e8e8] border border-[#ccc] rounded-[10px] shadow-lg">
                              <div className="font-roboto text-[#333] text-sm" style={{ padding: "12px 16px" }}>
                                <div className="flex flex-col items-center text-center">
                                  <span>{app.firstName ?? "—"}</span>
                                  <span>responded on</span>
                                  <span className="text-[#DC143C] font-bold">{symbol.callBackDate ?? "—"}</span>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        {symbol.type === "star" && <span className="text-[#DAA520]" style={{ fontFamily: "serif" }}>★</span>}
                        {symbol.type === "asterisk" && <span className="text-[#DC143C] font-bold">✱</span>}
                        {symbol.type === "none" && ""}
                      </td>
                      <td className={tdClass}>
                        {app.validEmp ? (
                          <span className="text-[#228B22]">✔</span>
                        ) : (
                          <span className="text-[#DC143C]">−</span>
                        )}
                      </td>
                      <td className={tdClass} style={dateAppliedBold}>{formatShortDate(app.dateApplied)}</td>
                      <td className={`${tdClass} overflow-hidden min-w-0 break-words`} style={nameBold}>{nameDisplay}</td>
                      <td className={tdClass} style={majorBold}>{app.major ?? "\u2014"}</td>
                      <td className={tdClass} style={schoolBold}>{app.school ?? "\u2014"}</td>
                      <td className={tdClass} style={levelBold}>{app.level ?? "\u2014"}</td>
                      <td className={tdClass} style={gradDateBold}>{formatGradDate(app.gradDate)}</td>
                      <td className={tdClass}>{app.skills?.trim() ?? ""}</td>
                      <td className={tdClass}>{app.foreignLanguage?.trim() ?? ""}</td>
                      <td className={`${tdClass} text-left`}>
                        <div className="flex flex-col gap-1 text-sm text-[#909090]">
                          {app.resumeId && app.resumeId.length > 15 ? (
                            <a
                              href={`https://apcstorage.blob.core.windows.net/resumes/${app.resumeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#909090] no-underline hover:underline"
                            >
                              Resume
                            </a>
                          ) : (
                            <span>Resume</span>
                          )}
                          {canEditApplicant && (
                            <Link
                              href={`/Applicants/Edit/${app.id}`}
                              className="text-[#909090] no-underline hover:underline"
                            >
                              Edit
                            </Link>
                          )}
                          <Link
                            href={`/Applicants/Details/${app.id}`}
                            className="text-[#909090] no-underline hover:underline"
                          >
                            Details
                          </Link>
                          {canEditApplicant && (
                            deletingId === app.id ? (
                              <span>Deleting…</span>
                            ) : (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!confirm("Are you sure you want to permanently delete this applicant?")) return;
                                  setDeletingId(app.id);
                                  const res = await DELETE_APPLICANT_API(app.id);
                                  setDeletingId(null);
                                  if (res.ok) setApplicants((prev) => prev.filter((a) => a.id !== app.id));
                                }}
                                className="no-underline hover:underline bg-transparent border-0 cursor-pointer text-left font-normal"
                                style={{
                                  color: "#909090",
                                  opacity: 1,
                                  padding: 0,
                                  margin: 0,
                                  fontSize: "15px",
                                  lineHeight: "inherit",
                                  fontFamily: "inherit",
                                }}
                              >
                                Delete
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
