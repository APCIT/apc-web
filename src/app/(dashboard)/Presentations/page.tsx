'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GET_PRESENTATIONS_API,
  GET_ME_API,
  GET_COMPANIES_API,
  CREATE_PRESENTATION_API,
  type PresentationItem,
  type CompanyItem,
} from "@/lib/api";

/** Read a File as base64 string (avoids multipart upload so the server handler runs immediately). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve(base64 ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Distinct semesters from presentations, ordered desc (same order as API). */
function getSemestersFromPresentations(presentations: PresentationItem[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of presentations) {
    if (!seen.has(p.semesterLabel)) {
      seen.add(p.semesterLabel);
      out.push(p.semesterLabel);
    }
  }
  return out;
}

/** Group presentations by semester label (order of keys = order of semesters). */
function groupBySemester(
  presentations: PresentationItem[],
  semesters: string[]
): Map<string, PresentationItem[]> {
  const map = new Map<string, PresentationItem[]>();
  for (const s of semesters) map.set(s, []);
  for (const p of presentations) {
    const list = map.get(p.semesterLabel);
    if (list) list.push(p);
  }
  return map;
}

function formatUploadDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const SEASONS = ["Spring", "Summer", "Fall"];

function getYearOptions(): number[] {
  const y = new Date().getFullYear();
  const out: number[] = [];
  for (let i = y - 2; i <= y + 1; i++) out.push(i);
  return out.reverse();
}

/** Initial accordion section shown until API semesters are loaded. */
const INITIAL_SEMESTER_LABEL = `Semester ${new Date().getFullYear()}`;

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<PresentationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refetchPresentations = () => {
    GET_PRESENTATIONS_API().then((res) => {
      if (res.ok) setPresentations(res.presentations);
    });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GET_PRESENTATIONS_API()
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setPresentations(res.presentations);
        else setError(res.error);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load presentations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    GET_ME_API().then((res) => {
      if (!cancelled && res.ok) setRoles(res.roles);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!roles.includes("IT")) return;
    let cancelled = false;
    GET_COMPANIES_API().then((res) => {
      if (!cancelled && res.ok) setCompanies(res.companies);
    });
    return () => {
      cancelled = true;
    };
  }, [roles]);

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const form = formRef.current;
    const fileInput = fileInputRef.current;
    if (!form || !fileInput) return;
    setUploadError(null);
    setUploadSuccess(false);
    const name = (form.elements.namedItem("presentationName") as HTMLInputElement | null)?.value?.trim() ?? "";
    const companyId = (form.elements.namedItem("companyId") as HTMLSelectElement | null)?.value ?? "";
    const season = (form.elements.namedItem("presentationSeason") as HTMLSelectElement | null)?.value ?? "";
    const year = (form.elements.namedItem("presentationYear") as HTMLSelectElement | null)?.value ?? "";
    const file = fileInput.files?.[0];
    if (!file || file.size === 0) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!name) {
      setUploadError("Name(s) is required.");
      return;
    }
    if (!companyId) {
      setUploadError("Please select a company.");
      return;
    }
    if (!season || !year) {
      setUploadError("Please select semester (season and year).");
      return;
    }
    setUploadLoading(true);
    setUploadError(null);
    const abort = new AbortController();
    const timeoutId = setTimeout(() => abort.abort(), 120_000);
    try {
      const presentationFileBase64 = await fileToBase64(file);
      const payload = {
        presentationFileBase64,
        presentationFileName: file.name,
        presentationName: name,
        companyId,
        presentationSeason: season,
        presentationYear: year,
      };
      const res = await CREATE_PRESENTATION_API(payload, { signal: abort.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        form.reset();
        fileInput.value = "";
        setSelectedFileName(null);
        setUploadSuccess(true);
        refetchPresentations();
      } else {
        setUploadError(res.error);
      }
    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      setUploadError(isAbort ? "Upload timed out. Please try again." : "Upload failed. Check your connection or try again.");
    } finally {
      clearTimeout(timeoutId);
      setUploadLoading(false);
    }
  };

  const semesters = useMemo(
    () => getSemestersFromPresentations(presentations),
    [presentations]
  );
  const displaySemesters = useMemo(
    () => (loading ? [INITIAL_SEMESTER_LABEL] : semesters),
    [loading, semesters]
  );
  const bySemester = useMemo(
    () => groupBySemester(presentations, displaySemesters),
    [presentations, displaySemesters]
  );

  const isIT = roles.includes("IT");
  const yearOptions = getYearOptions();

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {isIT && (
          <>
            <div className="mb-6">
              <h2
                className="text-[36px] font-roboto"
                style={{ fontWeight: 'normal', color: '#000000' }}
              >
                New Presentation
              </h2>
            </div>

            <form ref={formRef} className="max-w-4xl">
              {/* Name(s) */}
              <div className="flex items-center" style={{ marginBottom: '24px' }}>
                <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
                  Name(s)
                </label>
                <div className="flex-1" style={{ marginLeft: '20px' }}>
                  <input
                    type="text"
                    name="presentationName"
                    className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] focus:outline-none focus:border-[#666] h-[40px]"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center" style={{ marginBottom: '24px' }}>
                <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
                  Company
                </label>
                <div className="flex-1" style={{ marginLeft: '20px' }}>
                  <select
                    name="companyId"
                    className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester */}
              <div className="flex items-center" style={{ marginBottom: '24px' }}>
                <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
                  Semester
                </label>
                <div className="flex-1 flex" style={{ marginLeft: '20px' }}>
                  <select
                    name="presentationSeason"
                    className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
                  >
                    <option value="">Season</option>
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    name="presentationYear"
                    className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
                    style={{ marginLeft: '20px' }}
                  >
                    <option value="">Year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File */}
              <div className="flex items-center" style={{ marginBottom: '24px' }}>
                <div className="w-[180px]"></div>
                <div className="flex-1" style={{ marginLeft: '20px' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="presentationFile"
                    className="font-roboto text-[14px]"
                    onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name ?? null)}
                  />
                  <p className="font-roboto text-[14px] text-[#666] mt-1">
                    {selectedFileName ? (
                      <span className="text-green-700">File chosen: {selectedFileName}</span>
                    ) : (
                      <span>No file chosen</span>
                    )}
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="flex items-center" style={{ marginBottom: '12px' }}>
                  <div className="w-[180px]"></div>
                  <div className="flex-1 font-roboto text-red-600 text-sm" style={{ marginLeft: '20px' }}>{uploadError}</div>
                </div>
              )}
              {uploadSuccess && (
                <div className="flex items-center" style={{ marginBottom: '12px' }}>
                  <div className="w-[180px]"></div>
                  <div className="flex-1 font-roboto text-green-600 text-sm" style={{ marginLeft: '20px' }}>Presentation uploaded successfully.</div>
                </div>
              )}

              {/* Upload */}
              <div className="flex items-center mt-4">
                <div className="w-[180px]"></div>
                <div className="flex-1 flex items-center gap-3" style={{ marginLeft: '20px' }}>
                  <button
                    type="button"
                    disabled={uploadLoading}
                    onClick={handleUpload}
                    className="presentation-upload-btn inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] bg-white text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? "Uploading…" : "Upload"}
                  </button>
                  {uploadError === "Please select a file to upload." && (
                    <span className="font-roboto text-sm text-red-600">No file was uploaded. Try again.</span>
                  )}
                </div>
              </div>
            </form>
          </>
        )}

        <div className="mt-16">
          <div className="mb-6 text-center">
            <h2
              className="text-[30px] font-roboto"
              style={{ fontWeight: 'normal', color: '#000000' }}
            >
              End of Semester Presentations
            </h2>
          </div>

          <div className="manage-accordion px-4 mt-8">
            {error && (
              <p className="font-roboto text-red-600 mb-4">{error}</p>
            )}
            {!loading && displaySemesters.length === 0 && (
              <p className="font-roboto text-[#666]">No presentations yet. Upload one to see semester sections here.</p>
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
                indicator: "text-black"
              }}
            >
              {displaySemesters.map((semesterLabel) => (
                <AccordionItem
                  key={semesterLabel}
                  aria-label={semesterLabel}
                  title={<span className="!font-bold" style={{ fontWeight: 700 }}>{semesterLabel}</span>}
                  HeadingComponent="div"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <thead>
                        <tr className="bg-[#9E1B32]">
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Name(s)
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Company
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Upload Date
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Uploaded By
                          </th>
                          <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && semesterLabel === INITIAL_SEMESTER_LABEL ? (
                          <tr>
                            <td colSpan={5} className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                              Loading…
                            </td>
                          </tr>
                        ) : (
                          (bySemester.get(semesterLabel) ?? []).map((p) => (
                            <tr key={p.id} className="bg-white hover:bg-[#f5f5f5]">
                              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                {p.name || '\u00A0'}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                {p.company || '\u00A0'}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                {formatUploadDate(p.uploadDate)}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                                {p.uploader || '\u00A0'}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-center align-middle">
                                <a
                                  href={`https://apcstorage.blob.core.windows.net/presentations/${p.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#909090] no-underline hover:underline text-sm inline-flex items-center justify-center"
                                >
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
                                    <path d="M12 4v10" />
                                    <path d="M8 10l4 4 4-4" />
                                    <path d="M5 20h14" />
                                  </svg>
                                  <span className="ml-2">Download</span>
                                </a>
                              </td>
                            </tr>
                          ))
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
    </div>
  );
}

