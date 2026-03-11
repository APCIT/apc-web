"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  GET_APPLICANT_API,
  GET_ME_API,
  UPDATE_APPLICANT_COMMENT_API,
  UPDATE_APPLICANT_NOTE_API,
  UPDATE_APPLICANT_RESUME_API,
  DELETE_APPLICANT_API,
  PROMOTE_APPLICANT_API,
  GET_COMPANIES_API,
  type ApplicantEditItem,
  type CompanyItem,
} from "@/lib/api";

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

/** Cloud-upload icon for Update Resume button. */
function CloudUploadIcon() {
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
      aria-hidden
    >
      <path d="M7 18a4 4 0 0 1 0-8h.5A5.5 5.5 0 0 1 19 11a3.5 3.5 0 0 1-1 6.9H14" />
      <path d="M12 18V10" />
      <path d="M9.5 13.5 12 11l2.5 2.5" />
    </svg>
  );
}

/** Chevron-up icon for Promote to Intern button. */
function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

/** Remove (X) icon for Delete Applicant button. */
function RemoveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

/** Same look as Interns Details action buttons. */
const actionButtonClass =
  "inline-flex items-center justify-center gap-2 px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

/** Input/select style for Promote modal – same height for text inputs and dropdowns. */
const promoteInputClass =
  "w-[200px] max-w-[200px] min-h-[40px] h-[40px] px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] box-border";

/** Modal footer buttons – same as Time page (Hometown/Mentor). */
const modalButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

const skeletonStyle = {
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

/** Accordion item classes – same as Interns Details section. */
const detailsAccordionItemClasses = {
  base: "px-0 shadow-none border border-gray-300 rounded-lg mb-2",
  heading: "m-0 p-0",
  trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg py-2",
  title: "text-[14px] font-normal text-[#666666] text-left",
  titleWrapper: "flex-1",
  content: "bg-white rounded-lg",
  indicator: "text-black",
};

/** Table row for accordion content – same style as Interns Details. */
function TableRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="font-roboto text-[14px]">
      <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
        {label}
      </th>
      <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
        {value ?? "\u2014"}
      </td>
    </tr>
  );
}

/** Phone as (XXX) XXX-XXXX. */
function formatPhone(phone: string | null | undefined): string | undefined {
  if (!phone?.trim()) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.trim() || undefined;
}

/** Permanent address: line1 = street + optional "Apt. apt"; line2 = "City, State Zip". If no street, return undefined. */
function formatPermanentAddress(a: ApplicantEditItem | null): React.ReactNode {
  if (!a?.street?.trim()) return undefined;
  const line1 = [a.street.trim(), a.apt?.trim() ? `Apt. ${a.apt.trim()}` : ""].filter(Boolean).join(" ");
  const line2 = [a.city?.trim(), a.state?.trim(), a.zip?.trim()].filter(Boolean).join(", ");
  return (
    <span className="block font-roboto text-[14px] text-[#666]">
      <span className="block">{line1}</span>
      {line2 ? <span className="block">{line2}</span> : null}
    </span>
  );
}

/** Emergency: name, relationship, phone (formatted). If no ContactName, "None". */
function formatEmergency(a: ApplicantEditItem | null): React.ReactNode {
  if (!a) return undefined;
  if (!a.contactName?.trim()) return "None";
  const parts = [a.contactName.trim(), a.contactRelationship?.trim(), a.contactPhone?.trim() ? formatPhone(a.contactPhone) : null].filter(Boolean);
  return parts.join(" -- ");
}

/** Employment accordion: green check if true, red minus if false. */
function EmploymentCheck({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="text-[#228B22]">✔</span>
  ) : (
    <span className="text-[#DC143C]">−</span>
  );
}

/** Interviewed: interviewed && !callBack → green check; callBack → phone icon; else red minus. */
function InterviewedCell({ interviewStatus, callBack }: { interviewStatus: boolean; callBack: boolean }) {
  if (callBack) {
    return (
      <span title="Called back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="inline-block">
          <rect x="4" y="1" width="8" height="14" rx="1" ry="1" />
          <line x1="6" y1="12" x2="10" y2="12" />
        </svg>
      </span>
    );
  }
  if (interviewStatus) return <span className="text-[#228B22]">✔</span>;
  return <span className="text-[#DC143C]">−</span>;
}

const APPLICANT_ACTIONS = [
  { label: "Promote to Intern", key: "promote" },
  { label: "Update Resume", key: "update-resume" },
  { label: "Delete Applicant", key: "delete" },
  { label: "View Resume", key: "view-resume" },
  { label: "Edit Details", key: "edit-details" },
];

export default function ApplicantsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const idNum = Number(id);

  const [applicant, setApplicant] = useState<ApplicantEditItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const updateResumeDisclosure = useDisclosure();
  const [updateResumeLoading, setUpdateResumeLoading] = useState(false);
  const [updateResumeError, setUpdateResumeError] = useState<string | null>(null);
  const [updateResumeSelectedFileName, setUpdateResumeSelectedFileName] = useState<string | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  const canUpdateResume = !!roles?.some((r) => ["admin", "IT", "staff"].includes(r));
  const canDeleteApplicant = !!roles?.some((r) => ["admin", "IT"].includes(r));
  const canPromote = !!roles?.some((r) => ["admin", "IT"].includes(r));
  const [deleteLoading, setDeleteLoading] = useState(false);
  const promoteDisclosure = useDisclosure();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [promoteCwid, setPromoteCwid] = useState("");
  const [promoteCompanyId, setPromoteCompanyId] = useState(0);
  const [promoteWage, setPromoteWage] = useState("");
  const [promoteSemesterSeason, setPromoteSemesterSeason] = useState("");
  const [promoteSemesterYear, setPromoteSemesterYear] = useState("");
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [promoteLoading, setPromoteLoading] = useState(false);

  useEffect(() => {
    GET_ME_API()
      .then((res) => { if (res.ok) setRoles(res.roles); })
      .finally(() => setRolesLoading(false));
  }, []);

  const onPromoteOpen = useCallback(() => {
    setPromoteError(null);
    setPromoteCwid("");
    setPromoteCompanyId(0);
    setPromoteWage("7.25");
    const now = new Date();
    setPromoteSemesterYear(String(now.getFullYear()));
    setPromoteSemesterSeason("");
    GET_COMPANIES_API().then((res) => {
      if (res.ok) setCompanies(res.companies);
    });
    promoteDisclosure.onOpen();
  }, [promoteDisclosure]);

  const handlePromoteSubmit = useCallback(async () => {
    if (!idNum || promoteLoading) return;
    const cwid = promoteCwid.trim();
    const wageNum = Number(promoteWage);
    if (cwid.length !== 8) {
      setPromoteError("CWID must be exactly 8 characters.");
      return;
    }
    if (!Number.isFinite(wageNum) || wageNum < 7.25) {
      setPromoteError("Wage must be at least 7.25.");
      return;
    }
    if (!promoteCompanyId || promoteCompanyId <= 0) {
      setPromoteError("Please select a company.");
      return;
    }
    if (!promoteSemesterSeason.trim() || !promoteSemesterYear.trim()) {
      setPromoteError("Please select semester (season and year).");
      return;
    }
    setPromoteError(null);
    setPromoteLoading(true);
    const res = await PROMOTE_APPLICANT_API(idNum, {
      cwid,
      companyId: promoteCompanyId,
      wage: wageNum,
      semesterSeason: promoteSemesterSeason,
      semesterYear: promoteSemesterYear,
    });
    setPromoteLoading(false);
    if (res.ok) {
      promoteDisclosure.onClose();
      router.push("/Interns");
    } else {
      setPromoteError((res as { error: string }).error ?? "Failed to promote applicant");
    }
  }, [idNum, promoteCwid, promoteWage, promoteCompanyId, promoteSemesterSeason, promoteSemesterYear, promoteLoading, promoteDisclosure]);

  useEffect(() => {
    if (!id || Number.isNaN(idNum)) {
      setLoadError("Invalid applicant id");
      setLoading(false);
      return;
    }
    GET_APPLICANT_API(idNum)
      .then((res) => {
        if (res.ok) {
          const a = res.applicant;
          setApplicant(a);
          setCommentValue(a.comment ?? "");
          setNoteValue(a.note ?? "");
        } else {
          setLoadError(res.error ?? "Failed to load applicant");
        }
      })
      .catch(() => setLoadError("Failed to load applicant"))
      .finally(() => setLoading(false));
  }, [id, idNum]);

  const handleSaveComment = async () => {
    if (!idNum || commentSaving) return;
    setCommentError(null);
    setCommentSaving(true);
    const res = await UPDATE_APPLICANT_COMMENT_API(idNum, commentValue);
    setCommentSaving(false);
    if (res.ok && applicant) setApplicant({ ...applicant, comment: commentValue });
    else setCommentError(res.ok ? null : (res as { error: string }).error);
  };

  const handleSaveNote = async () => {
    if (!idNum || noteSaving) return;
    setNoteError(null);
    setNoteSaving(true);
    const res = await UPDATE_APPLICANT_NOTE_API(idNum, noteValue);
    setNoteSaving(false);
    if (res.ok && applicant) setApplicant({ ...applicant, note: noteValue });
    else setNoteError(res.ok ? null : (res as { error: string }).error);
  };

  const handleUpdateResumeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!idNum) return;
      const file = resumeFileInputRef.current?.files?.[0];
      if (!file || file.size === 0) {
        setUpdateResumeError("Please select a file to upload.");
        return;
      }
      setUpdateResumeError(null);
      setUpdateResumeLoading(true);
      const abort = new AbortController();
      const timeoutId = setTimeout(() => abort.abort(), 120_000);
      try {
        const resumeFileBase64 = await fileToBase64(file);
        const res = await UPDATE_APPLICANT_RESUME_API(
          idNum,
          { resumeFileBase64, resumeFileName: file.name },
          { signal: abort.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          updateResumeDisclosure.onClose();
          const getRes = await GET_APPLICANT_API(idNum);
          if (getRes.ok && getRes.applicant) setApplicant(getRes.applicant);
          if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
          setUpdateResumeSelectedFileName(null);
        } else {
          setUpdateResumeError((res as { error: string }).error ?? "Failed to update resume");
        }
      } catch (err) {
        const isAbort = err instanceof Error && err.name === "AbortError";
        setUpdateResumeError(
          isAbort ? "Upload timed out. Please try again." : "Failed to update resume"
        );
      } finally {
        clearTimeout(timeoutId);
        setUpdateResumeLoading(false);
      }
    },
    [idNum, updateResumeDisclosure]
  );

  const displayName = applicant
    ? [applicant.firstName, applicant.lastName].filter(Boolean).join(" ")
    : "";

  if (loadError) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <div style={{ height: "20px" }} />
          <div className="text-center text-red-600 mb-6">{loadError}</div>
          <div>
            <Link href="/Applicants" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back to Applicants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: 24 }} aria-hidden />

        <Link href="/Applicants" className={backButtonClass}>
          Back to Applicants
        </Link>

        <h2
          className="font-roboto mt-6 mb-6 text-center"
          style={{ fontSize: 24, fontWeight: "normal", color: "#900" }}
        >
          Applicant{" "}
          {loading ? (
            <span
              className="inline-block align-middle ml-1"
              style={{ ...skeletonStyle, width: "160px", height: "24px" }}
              aria-hidden
            />
          ) : (
            displayName ? ` - ${displayName}` : ""
          )}
        </h2>

        {/* Details and Actions – section titles */}
        <div className="grid grid-cols-2 min-w-0" style={{ columnGap: "80px" }}>
          <h3
            className="font-roboto min-w-0 col-span-1 text-center"
            style={{ fontSize: 24, fontWeight: "normal", color: "#900" }}
          >
            Details
          </h3>
          <h3
            className="font-roboto min-w-0 col-span-1 text-center"
            style={{ fontSize: 24, fontWeight: "normal", color: "#900" }}
          >
            Actions
          </h3>
        </div>
        <hr className="border-0 border-t border-[#ddd] my-4 w-full" />

        <div className="grid grid-cols-2 min-w-0" style={{ columnGap: "80px" }}>
          {/* Details – three accordions (placeholder content, no backend) */}
          <div className="min-w-0">
            <div className="manage-accordion max-w-md">
              <Accordion
                disableIndicatorAnimation={false}
                showDivider={false}
                selectionMode="single"
                itemClasses={detailsAccordionItemClasses}
              >
                <AccordionItem
                  key="personal"
                  aria-label="Personal"
                  title="Personal"
                  HeadingComponent="div"
                >
                  <div className="p-0">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <tbody>
                        <TableRow label="Name" value={displayName || undefined} />
                        <TableRow label="Email" value={applicant?.email || undefined} />
                        <TableRow label="Phone" value={applicant ? formatPhone(applicant.phone) : undefined} />
                        <TableRow label="Permanent Address" value={formatPermanentAddress(applicant)} />
                        <TableRow label="Emergency" value={formatEmergency(applicant)} />
                        <TableRow label="How did you hear about us?" value={applicant?.hearAboutUs?.trim() || undefined} />
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="school"
                  aria-label="School"
                  title="School"
                  HeadingComponent="div"
                >
                  <div className="p-0">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <tbody>
                        <TableRow label="School" value={applicant?.school || undefined} />
                        <TableRow label="Major" value={applicant?.major || undefined} />
                        <TableRow label="Minor" value={applicant ? (applicant.minor?.trim() ? applicant.minor : "N/A") : undefined} />
                        <TableRow label="Foreign Language" value={applicant ? (applicant.foreignLanguage?.trim() ? applicant.foreignLanguage : "N/A") : undefined} />
                        <TableRow label="Level" value={applicant?.level || undefined} />
                        <TableRow label="Graduation" value={applicant?.gradDate ?? undefined} />
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="employment"
                  aria-label="Employment"
                  title="Employment"
                  HeadingComponent="div"
                >
                  <div className="p-0">
                    <table className="w-full border-collapse font-roboto text-sm">
                      <tbody>
                        <TableRow label="Date Applied" value={applicant?.dateApplied ?? undefined} />
                        <TableRow label="Preference" value={applicant?.preference?.trim() || undefined} />
                        <TableRow
                          label="Valid US Employee"
                          value={applicant ? <EmploymentCheck checked={applicant.validEmp} /> : undefined}
                        />
                        <TableRow label="Availability" value={applicant?.semester?.trim() || undefined} />
                        <TableRow label="Birmingham" value={applicant ? <EmploymentCheck checked={applicant.birmingham} /> : undefined} />
                        <TableRow label="Huntsville" value={applicant ? <EmploymentCheck checked={applicant.huntsville} /> : undefined} />
                        <TableRow label="Mobile" value={applicant ? <EmploymentCheck checked={applicant.mobile} /> : undefined} />
                        <TableRow label="Montgomery" value={applicant ? <EmploymentCheck checked={applicant.montgomery} /> : undefined} />
                        <TableRow label="Tuscaloosa" value={applicant ? <EmploymentCheck checked={applicant.tuscaloosa} /> : undefined} />
                        <TableRow label="Anniston/Gadsden" value={applicant ? <EmploymentCheck checked={applicant.annistonGadsden} /> : undefined} />
                        <TableRow label="Dothan" value={applicant ? <EmploymentCheck checked={applicant.dothan} /> : undefined} />
                        <TableRow label="Blue Springs" value={applicant ? <EmploymentCheck checked={applicant.blueSprings} /> : undefined} />
                        <TableRow label="Skills" value={applicant?.skills?.trim() || undefined} />
                        <TableRow
                          label="Interviewed"
                          value={applicant ? <InterviewedCell interviewStatus={applicant.interviewStatus} callBack={applicant.callBack} /> : undefined}
                        />
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Interview Comment
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            <div className="flex flex-col gap-2 w-full max-w-md">
                              <textarea
                                value={commentValue}
                                onChange={(e) => setCommentValue(e.target.value)}
                                className="w-full min-h-[80px] px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666]"
                                aria-label="Interview Comment"
                              />
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={handleSaveComment}
                                  disabled={commentSaving}
                                  className="inline-flex items-center justify-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] font-normal cursor-pointer select-none disabled:opacity-50"
                                >
                                  {commentSaving ? "Saving…" : "Save"}
                                </button>
                                {commentError && <span className="text-red-600 text-sm">{commentError}</span>}
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Note
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            <div className="flex flex-col gap-2 w-full max-w-md">
                              <textarea
                                value={noteValue}
                                onChange={(e) => setNoteValue(e.target.value)}
                                className="w-full min-h-[80px] px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666]"
                                aria-label="Note"
                              />
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={handleSaveNote}
                                  disabled={noteSaving}
                                  className="inline-flex items-center justify-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] font-normal cursor-pointer select-none disabled:opacity-50"
                                >
                                  {noteSaving ? "Saving…" : "Save"}
                                </button>
                                {noteError && <span className="text-red-600 text-sm">{noteError}</span>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Actions – five buttons */}
          <div className="min-w-0">
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {APPLICANT_ACTIONS.map(({ label, key }) => (
                <div key={key}>
                  {key === "edit-details" ? (
                    <Link
                      href={`/Applicants/Edit/${id}`}
                      className={actionButtonClass + " no-underline"}
                    >
                      <span>{label}</span>
                    </Link>
                  ) : key === "update-resume" ? (
                    rolesLoading || !idNum ? (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <CloudUploadIcon />
                        <span>{label}</span>
                      </button>
                    ) : canUpdateResume ? (
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => {
                          setUpdateResumeError(null);
                          setUpdateResumeSelectedFileName(null);
                          if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
                          updateResumeDisclosure.onOpen();
                        }}
                      >
                        <CloudUploadIcon />
                        <span>{label}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <CloudUploadIcon />
                        <span>{label}</span>
                      </button>
                    )
                  ) : key === "delete" ? (
                    rolesLoading || !idNum ? (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <RemoveIcon />
                        <span>{label}</span>
                      </button>
                    ) : canDeleteApplicant ? (
                      <button
                        type="button"
                        className={actionButtonClass}
                        disabled={deleteLoading}
                        onClick={async () => {
                          if (!confirm("Are you sure you want to permanently delete this applicant?")) return;
                          setDeleteLoading(true);
                          const res = await DELETE_APPLICANT_API(idNum);
                          setDeleteLoading(false);
                          if (res.ok) router.push("/Applicants");
                        }}
                      >
                        <RemoveIcon />
                        <span>{deleteLoading ? "Deleting…" : label}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <RemoveIcon />
                        <span>{label}</span>
                      </button>
                    )
                  ) : key === "promote" ? (
                    rolesLoading || !idNum ? (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <ChevronUpIcon />
                        <span>{label}</span>
                      </button>
                    ) : canPromote ? (
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={onPromoteOpen}
                      >
                        <ChevronUpIcon />
                        <span>{label}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                        disabled
                        aria-disabled="true"
                      >
                        <ChevronUpIcon />
                        <span>{label}</span>
                      </button>
                    )
                  ) : key === "view-resume" ? (
                    applicant?.resumeId && applicant.resumeId.length > 15 ? (
                      <a
                        href={`https://apcstorage.blob.core.windows.net/resumes/${encodeURIComponent(applicant.resumeId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={actionButtonClass + " no-underline"}
                      >
                        <span>{label}</span>
                      </a>
                    ) : (
                      <span className={actionButtonClass + " cursor-default inline-flex"}>
                        <span>{label}</span>
                      </span>
                    )
                  ) : (
                    <button type="button" className={actionButtonClass}>
                      <span>{label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={updateResumeDisclosure.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setUpdateResumeError(null);
            setUpdateResumeSelectedFileName(null);
            if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
            updateResumeDisclosure.onClose();
          }
        }}
        hideCloseButton
      >
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">Update Resume</h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>
              Accepted: PDF, DOC, DOCX. Choose a file to replace the current resume.
            </p>
          </ModalHeader>
          <ModalBody className="gap-4 flex flex-col items-center" style={{ paddingBottom: 24 }}>
            <div className="flex items-center font-roboto justify-center">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0" htmlFor="updateApplicantResumeFile">
                Resume file:{" "}
              </label>
              <input
                ref={resumeFileInputRef}
                type="file"
                name="resume"
                id="updateApplicantResumeFile"
                accept=".pdf,.doc,.docx"
                aria-label="Resume file"
                className="font-roboto text-[14px] w-[200px] max-w-[200px]"
                style={{ marginLeft: 24 }}
                onChange={(e) =>
                  setUpdateResumeSelectedFileName(e.target.files?.[0]?.name ?? null)
                }
              />
            </div>
            <p className="font-roboto text-[14px] text-[#666] text-center w-full">
              {updateResumeSelectedFileName ? (
                <span className="text-green-700">File chosen: {updateResumeSelectedFileName}</span>
              ) : (
                <span>No file chosen</span>
              )}
            </p>
            {updateResumeError && (
              <p className="text-red-600 text-sm font-roboto text-center w-full">{updateResumeError}</p>
            )}
          </ModalBody>
          <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                setUpdateResumeError(null);
                setUpdateResumeSelectedFileName(null);
                if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
                updateResumeDisclosure.onClose();
              }}
              className={modalButtonClass}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={updateResumeLoading}
              onClick={handleUpdateResumeClick}
              className={modalButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {updateResumeLoading ? "Updating…" : "Update"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={promoteDisclosure.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPromoteError(null);
            promoteDisclosure.onClose();
          }
        }}
        hideCloseButton
      >
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">
              Promote {applicant ? [applicant.firstName, applicant.lastName].filter(Boolean).join(" ") : "Applicant"} to Intern
            </h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>
              *All fields are required and must be valid, or data will not be saved.
            </p>
          </ModalHeader>
          <ModalBody className="flex flex-col items-center" style={{ paddingBottom: 24 }}>
            <div className="flex items-center font-roboto justify-center mb-4">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">CWID: </label>
              <input
                type="text"
                maxLength={8}
                className={promoteInputClass}
                style={{ marginLeft: 24 }}
                value={promoteCwid}
                onChange={(e) => setPromoteCwid(e.target.value.slice(0, 8))}
                aria-label="CWID"
                placeholder="8 characters"
              />
            </div>
            <div className="flex items-center font-roboto justify-center mb-4">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Company: </label>
              <select
                className={promoteInputClass}
                style={{ marginLeft: 24 }}
                value={promoteCompanyId || ""}
                onChange={(e) => setPromoteCompanyId(Number(e.target.value))}
                aria-label="Company"
              >
                <option value="">Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.abbreviation || `Company ${c.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center font-roboto justify-center mb-4">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Wage: </label>
              <input
                type="text"
                inputMode="decimal"
                className={promoteInputClass}
                style={{ marginLeft: 24 }}
                value={promoteWage}
                onChange={(e) => setPromoteWage(e.target.value)}
                aria-label="Wage"
                placeholder="Min 7.25"
              />
            </div>
            <div className="flex items-center font-roboto justify-center mb-4">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Semester: </label>
              <select
                className={promoteInputClass}
                style={{ marginLeft: 24 }}
                value={promoteSemesterSeason}
                onChange={(e) => setPromoteSemesterSeason(e.target.value)}
                aria-label="Semester season"
              >
                <option value="">Season</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            <div className="flex items-center font-roboto justify-center mb-4">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Year: </label>
              <select
                className={promoteInputClass}
                style={{ marginLeft: 24 }}
                value={promoteSemesterYear}
                onChange={(e) => setPromoteSemesterYear(e.target.value)}
                aria-label="Semester year"
              >
                <option value="">Year</option>
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
              </select>
            </div>
            {promoteError && (
              <p className="text-red-600 text-sm font-roboto text-center w-full">{promoteError}</p>
            )}
          </ModalBody>
          <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                setPromoteError(null);
                promoteDisclosure.onClose();
              }}
              className={modalButtonClass}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={promoteLoading}
              onClick={handlePromoteSubmit}
              className={modalButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {promoteLoading ? "Promoting…" : "Promote to Intern"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
