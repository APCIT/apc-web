"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import {
  GET_APPLICANTS_SEARCH_API,
  GET_ME_API,
  DELETE_APPLICANT_API,
  type ApplicantSearchItem,
} from "@/lib/api";

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

function getSymbol(app: ApplicantSearchItem): { type: "check" | "phone" | "star" | "asterisk" | "none"; callBackDate?: string } {
  if (app.interviewStatus && !app.callBack && !(app.note?.trim())) return { type: "check" };
  if (app.callBack) return { type: "phone", callBackDate: formatCallBackDate(app.callBackDate) };
  if (app.prevIntern) return { type: "star" };
  if (app.note?.trim()) return { type: "asterisk" };
  return { type: "none" };
}

/**
 * Client-side export: snapshot of the results table as an Excel-openable file.
 * Uses the current DOM table (id="results") including any client-side sort.
 * No server request; same behavior as legacy SearchResults export.
 */
function exportTableToExcel(tableId: string, filename?: string) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tableHtml = table.outerHTML;
  const defaultName = "ApplicantSearchResults.xls";
  const doc =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>' +
    tableHtml +
    "</body></html>";
  const blob = new Blob(["\uFEFF" + doc], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename?.trim() || defaultName;
  a.click();
  URL.revokeObjectURL(url);
}

const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center cursor-pointer select-none";
const tdClass = "border border-[#ddd] p-[10px] text-center align-middle text-[#666]";
const boldStyle: CSSProperties = { fontWeight: "bold" };

export default function ApplicantSearchResultsPage() {
  const searchParams = useSearchParams();
  const [applicants, setApplicants] = useState<ApplicantSearchItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState(true);

  const canEditApplicant = useMemo(() => roles.includes("admin") || roles.includes("IT"), [roles]);

  // Support PascalCase (legacy) and camelCase; pass camelCase to API.
  const searchParamsObj = useMemo(() => {
    const get = (pascal: string, camel: string) =>
      searchParams.get(pascal)?.trim() ?? searchParams.get(camel)?.trim() ?? "";
    return {
      firstName: get("FirstName", "firstName"),
      lastName: get("LastName", "lastName"),
      school: get("School", "school"),
      major: get("Major", "major"),
      minor: get("Minor", "minor"),
      level: get("Level", "level"),
      semester: get("Semester", "semester"),
      city: get("City", "city"),
      foreignLanguage: get("ForeignLanguage", "foreignLanguage"),
      skills: get("Skills", "skills"),
      gradMonth: get("GradMonth", "gradMonth"),
      gradYear: get("GradYear", "gradYear"),
    };
  }, [searchParams]);

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) setRoles(res.roles);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GET_APPLICANTS_SEARCH_API(searchParamsObj)
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setApplicants(res.applicants);
          setCount(res.count);
        } else {
          setError(res.error);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load search results");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [searchParamsObj]);

  const handleSort = useCallback((colIndex: number) => {
    setSortCol((prev) => (prev === colIndex ? prev : colIndex));
    setSortAsc((prev) => (sortCol === colIndex ? !prev : true));
  }, [sortCol]);

  const getThStyle = useCallback((colIndex: number) => (sortCol >= 0 && sortCol === colIndex ? boldStyle : undefined), [sortCol]);
  const getTdStyle = useCallback((colIndex: number) => (sortCol >= 0 && sortCol === colIndex ? boldStyle : undefined), [sortCol]);

  const sortedApplicants = useMemo(() => {
    if (sortCol < 0) return applicants;
    const copy = [...applicants];
    const mult = sortAsc ? 1 : -1;
    copy.sort((a, b) => {
      let va: string | number | boolean | null;
      let vb: string | number | boolean | null;
      switch (sortCol) {
        case 0: {
          const order = (x: ApplicantSearchItem) => {
            if (x.callBack) return 0;
            if (x.prevIntern) return 1;
            if (x.interviewStatus && !x.callBack && !(x.note?.trim())) return 2;
            if (x.note?.trim() && !x.callBack) return 3;
            return 4;
          };
          return mult * (order(a) - order(b));
        }
        case 1: return mult * (a.prevIntern === b.prevIntern ? 0 : a.prevIntern ? 1 : -1);
        case 2: va = a.dateApplied; vb = b.dateApplied; return mult * (String(va).localeCompare(String(vb)));
        case 3: va = a.firstName ?? ""; vb = b.firstName ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 4: va = a.lastName ?? ""; vb = b.lastName ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 5: va = a.school ?? ""; vb = b.school ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 6: va = a.major ?? ""; vb = b.major ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 7: va = a.city ?? ""; vb = b.city ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 8: va = a.minor ?? ""; vb = b.minor ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 9: va = a.level ?? ""; vb = b.level ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 10: va = a.gradDate; vb = b.gradDate; return mult * (String(va).localeCompare(String(vb)));
        case 11: va = a.semester ?? ""; vb = b.semester ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 12: va = a.email ?? ""; vb = b.email ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 13: va = a.skills ?? ""; vb = b.skills ?? ""; return mult * (va as string).localeCompare(vb as string);
        case 14: va = a.foreignLanguage ?? ""; vb = b.foreignLanguage ?? ""; return mult * (va as string).localeCompare(vb as string);
        default: return 0;
      }
    });
    return copy;
  }, [applicants, sortCol, sortAsc]);

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />
        <div className="mb-6">
          <Link
            href="/Applicants/Search"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            Applicant Search
          </Link>
        </div>
        <h2 className="text-[24px] font-roboto mb-2" style={{ fontWeight: "normal", color: "#900" }}>
          Search Results
        </h2>
        <p className="font-roboto text-[#333] mb-4">
          {loading ? "Loading…" : `Your search returned ${count} result(s).`}
        </p>
        <p className="font-roboto text-sm text-[#666] mb-4">Sort by clicking the column header.</p>
        {error && <p className="font-roboto text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => exportTableToExcel("results", "ApplicantSearchResults")}
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] font-normal cursor-pointer"
          >
            Export Results
          </button>
        </div>
        <div className="overflow-x-auto">
          <table id="results" className="w-full border-collapse font-roboto text-sm table table-bordered">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className={`${thClass} w-[40px]`} style={getThStyle(0)} onClick={() => handleSort(0)} title="Sort">
                  <Popover placement="right">
                    <PopoverTrigger>
                      <button className="cursor-pointer bg-transparent border-none p-0 text-white hover:opacity-80" type="button" onClick={(e) => e.stopPropagation()}>
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
                <th className={thClass} style={getThStyle(1)} onClick={() => handleSort(1)}>Previous Intern</th>
                <th className={thClass} style={getThStyle(2)} onClick={() => handleSort(2)}>Date Applied</th>
                <th className={thClass} style={getThStyle(3)} onClick={() => handleSort(3)}>First Name</th>
                <th className={thClass} style={getThStyle(4)} onClick={() => handleSort(4)}>Last Name</th>
                <th className={thClass} style={getThStyle(5)} onClick={() => handleSort(5)}>School</th>
                <th className={thClass} style={getThStyle(6)} onClick={() => handleSort(6)}>Major</th>
                <th className={thClass} style={getThStyle(7)} onClick={() => handleSort(7)}>City</th>
                <th className={thClass} style={getThStyle(8)} onClick={() => handleSort(8)}>Minor</th>
                <th className={thClass} style={getThStyle(9)} onClick={() => handleSort(9)}>Level</th>
                <th className={thClass} style={getThStyle(10)} onClick={() => handleSort(10)}>Grad Date</th>
                <th className={thClass} style={getThStyle(11)} onClick={() => handleSort(11)}>Semester</th>
                <th className={thClass} style={getThStyle(12)} onClick={() => handleSort(12)}>E-Mail</th>
                <th className={thClass} style={{ ...getThStyle(13), minWidth: "120px" }} onClick={() => handleSort(13)}>Skills</th>
                <th className={thClass} style={getThStyle(14)} onClick={() => handleSort(14)}>Foreign Language</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={16} className={tdClass}>Loading…</td>
                </tr>
              ) : sortedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={16} className={tdClass}>No results.</td>
                </tr>
              ) : (
                sortedApplicants.map((app) => {
                  const symbol = getSymbol(app);
                  return (
                    <tr key={app.id} className="bg-white hover:bg-[#f5f5f5]">
                      <td className={tdClass} style={getTdStyle(0)}>
                        {symbol.type === "check" && <span className="text-[#228B22] font-bold">✔</span>}
                        {symbol.type === "phone" && (
                          <Popover placement="right">
                            <PopoverTrigger>
                              <button type="button" className="cursor-pointer bg-transparent border-none p-0 inline-flex align-middle text-[#333] hover:opacity-80" aria-label="Called back details">
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
                      <td className={tdClass} style={getTdStyle(1)}>{app.prevIntern ? "Yes" : "No"}</td>
                      <td className={tdClass} style={getTdStyle(2)}>{formatShortDate(app.dateApplied)}</td>
                      <td className={tdClass} style={getTdStyle(3)}>{app.firstName ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(4)}>{app.lastName ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(5)}>{app.school ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(6)}>{app.major ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(7)}>{app.city ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(8)}>{app.minor ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(9)}>{app.level ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(10)}>{formatGradDate(app.gradDate)}</td>
                      <td className={tdClass} style={getTdStyle(11)}>{app.semester ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(12)}>{app.email ?? "\u2014"}</td>
                      <td className={tdClass} style={getTdStyle(13)}>{app.skills?.trim() ?? ""}</td>
                      <td className={tdClass} style={getTdStyle(14)}>{app.foreignLanguage?.trim() ?? ""}</td>
                      <td className={`${tdClass} text-left`}>
                        <div className="flex flex-col gap-1 text-sm text-[#909090]">
                          {app.resumeId && app.resumeId.length > 15 ? (
                            <a href={`https://apcstorage.blob.core.windows.net/resumes/${app.resumeId}`} target="_blank" rel="noopener noreferrer" className="text-[#909090] no-underline hover:underline">Resume</a>
                          ) : (
                            <span>Resume</span>
                          )}
                          {canEditApplicant && (
                            <Link href={`/Applicants/Edit/${app.id}`} className="text-[#909090] no-underline hover:underline">Edit</Link>
                          )}
                          <Link href={`/Applicants/Details/${app.id}`} className="text-[#909090] no-underline hover:underline">Details</Link>
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
                                  if (res.ok) setCount((c) => Math.max(0, c - 1));
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
