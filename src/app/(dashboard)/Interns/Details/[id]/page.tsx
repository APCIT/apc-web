"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  GET_INTERN_DETAIL_API,
  GET_COMPANIES_API,
  PATCH_INTERN_CWID_API,
  PATCH_INTERN_COMPANY_API,
  PATCH_INTERN_DEPARTMENT_API,
  PATCH_INTERN_MENTOR_API,
  PATCH_INTERN_WAGE_API,
  PATCH_INTERN_NOTE_API,
  type InternDetailItem,
  type CompanyItem,
} from "@/lib/api";

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline";

const accordionItemClasses = {
  base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
  heading: "m-0 p-0",
  trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
  title: "text-[16px] font-normal text-[#666666] text-left",
  titleWrapper: "flex-1",
  content: "bg-white rounded-lg",
  indicator: "text-black",
};

/** Smaller accordions for Details section only; column still keeps half width. */
const detailsAccordionItemClasses = {
  base: "px-0 shadow-none border border-gray-300 rounded-lg mb-2",
  heading: "m-0 p-0",
  trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg py-2",
  title: "text-[14px] font-normal text-[#666666] text-left",
  titleWrapper: "flex-1",
  content: "bg-white rounded-lg",
  indicator: "text-black",
};

/** Same look and size as Back to Interns – content width. Spacing from parent gap. */
const actionButtonClass =
  "inline-flex items-center justify-center gap-2 px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

/** Skeleton/ghost style – same as Companies/Edit (gray pulse). */
const skeletonStyle = {
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

/** Cloud-with-arrow-down icon – same as Export ATN Report / Semester Timelogs on Interns page. */
function CloudDownloadIcon() {
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
      <path d="M12 10v9" />
      <path d="M9.5 15.5 12 18l2.5-2.5" />
    </svg>
  );
}

/** Document icon – same as Mid-Sem Report / Impact Calculator on PastInterns Details. */
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
      aria-hidden
    >
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/** Refresh/reload icon (New Semester). */
function RefreshIcon() {
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
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M21 21v-5h-5" />
    </svg>
  );
}

const LEFT_ACTIONS: { label: string; icon?: React.ReactNode }[] = [
  { label: "Export Timesheet", icon: <CloudDownloadIcon /> },
  { label: "Update Resume", icon: <CloudDownloadIcon /> },
  { label: "Update Impact Calc", icon: <CloudDownloadIcon /> },
  { label: "Update Presentation", icon: <CloudDownloadIcon /> },
  { label: "New Semester", icon: <RefreshIcon /> },
];
const RIGHT_ACTIONS: { label: string; icon?: React.ReactNode }[] = [
  { label: "View Resume", icon: <DocIcon /> },
  { label: "Impact Calculator", icon: <DocIcon /> },
  { label: "Presentation", icon: <DocIcon /> },
];

/** Left/right table row – same style as PastInterns Details. */
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
          <div
            style={{ height: "24px", width: "200px", ...skeletonStyle }}
            aria-hidden
          />
        ) : (
          value ?? "\u2014"
        )}
      </td>
    </tr>
  );
}

/** Phone as (XXX) XXX-XXXX. */
function formatPhone(phone: string | null): string | undefined {
  if (!phone || !phone.trim()) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.trim() || undefined;
}

/** DOB as "Month Day" (e.g. January 1). */
function formatDob(dob: string | null): string | undefined {
  if (!dob) return undefined;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return undefined;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Graduation as "MMM yyyy" (e.g. May 2025). */
function formatGraduation(gradDateIso: string | null): string | undefined {
  if (!gradDateIso) return undefined;
  const d = new Date(gradDateIso);
  if (Number.isNaN(d.getTime())) return undefined;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Address line from street, apt, city, state, zip. */
function formatAddress(i: InternDetailItem): string | undefined {
  if (!i.street?.trim()) return undefined;
  const parts = [
    i.street.trim(),
    i.apt?.trim(),
    i.city?.trim(),
    i.state?.trim(),
    i.zip?.trim(),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

/** Emergency: three lines (Name, Relationship, Phone) or "None". */
function EmergencyContent({ intern }: { intern: InternDetailItem }): React.ReactNode {
  const name = intern.contactName?.trim();
  const rel = intern.contactRelationship?.trim();
  const phone = intern.contactPhone?.trim();
  if (!name && !rel && !phone) return "None";
  return (
    <span className="block font-roboto text-[14px] text-[#666]">
      {name && <span className="block">{name}</span>}
      {rel && <span className="block">{rel}</span>}
      {phone && <span className="block">{formatPhone(phone)}</span>}
    </span>
  );
}

export default function InternDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const year = new Date().getFullYear();

  const [data, setData] = useState<{ intern: InternDetailItem } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cwidValue, setCwidValue] = useState("");
  const [cwidSaving, setCwidSaving] = useState(false);
  const [cwidError, setCwidError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [empDepartment, setEmpDepartment] = useState("");
  const [empMentorName, setEmpMentorName] = useState("");
  const [empMentorTitle, setEmpMentorTitle] = useState("");
  const [empMentorPhone, setEmpMentorPhone] = useState("");
  const [empMentorEmail, setEmpMentorEmail] = useState("");
  const [empWage, setEmpWage] = useState("");
  const [empNote, setEmpNote] = useState("");
  const [empCompanyId, setEmpCompanyId] = useState<number>(0);
  const [empSaving, setEmpSaving] = useState<"company" | "department" | "mentor" | "wage" | "note" | null>(null);
  const [empError, setEmpError] = useState<string | null>(null);

  const fetchDetail = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid intern id");
      return;
    }
    setLoading(true);
    setError(null);
    GET_INTERN_DETAIL_API(id)
      .then((res) => {
        if (res.ok) {
          setData({ intern: res.data.intern });
          setCwidValue(res.data.intern.cwid ?? "");
        } else {
          setError(res.error ?? "Failed to load intern");
          setData(null);
        }
      })
      .catch(() => setError("Failed to load intern"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    GET_COMPANIES_API().then((res) => {
      if (res.ok) setCompanies(res.companies);
    });
  }, []);

  useEffect(() => {
    const i = data?.intern;
    if (!i) return;
    setEmpDepartment(i.department ?? "");
    setEmpMentorName(i.mentorName ?? "");
    setEmpMentorTitle(i.mentorTitle ?? "");
    setEmpMentorPhone(i.mentorPhone ?? "");
    setEmpMentorEmail(i.mentorEmail ?? "");
    setEmpWage(i.wage != null ? String(i.wage) : "");
    setEmpNote(i.note ?? "");
    setEmpCompanyId(i.companyId ?? 0);
  }, [data?.intern]);

  const handleCwidSave = useCallback(() => {
    if (!id) return;
    setCwidSaving(true);
    setCwidError(null);
    PATCH_INTERN_CWID_API(id, cwidValue)
      .then((res) => {
        if (res.ok) {
          setData((prev) =>
            prev ? { intern: { ...prev.intern, cwid: cwidValue } } : null
          );
        } else {
          setCwidError(res.error ?? "Failed to update CWID");
        }
      })
      .catch(() => setCwidError("Failed to update CWID"))
      .finally(() => setCwidSaving(false));
  }, [id, cwidValue]);

  const saveCompany = useCallback(() => {
    if (!id || empCompanyId === 0) return;
    setEmpSaving("company");
    setEmpError(null);
    PATCH_INTERN_COMPANY_API(id, empCompanyId)
      .then((res) => {
        if (res.ok) {
          const name = companies.find((c) => c.id === empCompanyId)?.name ?? "";
          setData((prev) =>
            prev ? { intern: { ...prev.intern, companyName: name, companyId: empCompanyId } } : null
          );
        } else setEmpError(res.error ?? "Failed to update company");
      })
      .catch(() => setEmpError("Failed to update company"))
      .finally(() => setEmpSaving(null));
  }, [id, empCompanyId, companies]);

  const saveDepartment = useCallback(() => {
    if (!id) return;
    setEmpSaving("department");
    setEmpError(null);
    PATCH_INTERN_DEPARTMENT_API(id, empDepartment)
      .then((res) => {
        if (res.ok) {
          setData((prev) =>
            prev ? { intern: { ...prev.intern, department: empDepartment || null } } : null
          );
        } else setEmpError(res.error ?? "Failed to update department");
      })
      .catch(() => setEmpError("Failed to update department"))
      .finally(() => setEmpSaving(null));
  }, [id, empDepartment]);

  const saveMentor = useCallback(() => {
    if (!id) return;
    setEmpSaving("mentor");
    setEmpError(null);
    PATCH_INTERN_MENTOR_API(id, {
      mentorName: empMentorName,
      mentorTitle: empMentorTitle,
      mentorPhone: empMentorPhone,
      mentorEmail: empMentorEmail,
    })
      .then((res) => {
        if (res.ok) {
          setData((prev) =>
            prev
              ? {
                  intern: {
                    ...prev.intern,
                    mentorName: empMentorName || null,
                    mentorTitle: empMentorTitle || null,
                    mentorPhone: empMentorPhone || null,
                    mentorEmail: empMentorEmail || null,
                  },
                }
              : null
          );
        } else setEmpError(res.error ?? "Failed to update mentor");
      })
      .catch(() => setEmpError("Failed to update mentor"))
      .finally(() => setEmpSaving(null));
  }, [id, empMentorName, empMentorTitle, empMentorPhone, empMentorEmail]);

  const saveWage = useCallback(() => {
    if (!id) return;
    const num = parseFloat(empWage);
    if (Number.isNaN(num) || num < 0) {
      setEmpError("Invalid wage");
      return;
    }
    setEmpSaving("wage");
    setEmpError(null);
    PATCH_INTERN_WAGE_API(id, num)
      .then((res) => {
        if (res.ok) {
          setData((prev) => (prev ? { intern: { ...prev.intern, wage: num } } : null));
        } else setEmpError(res.error ?? "Failed to update wage");
      })
      .catch(() => setEmpError("Failed to update wage"))
      .finally(() => setEmpSaving(null));
  }, [id, empWage]);

  const saveNote = useCallback(() => {
    if (!id) return;
    setEmpSaving("note");
    setEmpError(null);
    PATCH_INTERN_NOTE_API(id, empNote)
      .then((res) => {
        if (res.ok) {
          setData((prev) => (prev ? { intern: { ...prev.intern, note: empNote || null } } : null));
        } else setEmpError(res.error ?? "Failed to update note");
      })
      .catch(() => setEmpError("Failed to update note"))
      .finally(() => setEmpSaving(null));
  }, [id, empNote]);

  if (error && !data) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">{error}</p>
          <Link href="/Interns" className={backButtonClass + " mt-4 inline-block"}>
            Back to Interns
          </Link>
        </div>
      </div>
    );
  }

  const intern = data?.intern ?? null;
  const showSkeleton = loading && !intern;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {/* Space above Back button */}
        <div style={{ height: 24 }} aria-hidden />

        <Link href="/Interns" className={backButtonClass}>
          Back to Interns
        </Link>

        <h2
          className="font-roboto mt-6 mb-6 text-center"
          style={{ fontSize: 24, fontWeight: "normal", color: "#900" }}
        >
          Intern
        </h2>

        {/* Semester Time Logs / Work Schedule accordions */}
        <div className="manage-accordion mb-8">
          <Accordion
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={accordionItemClasses}
          >
            <AccordionItem
              key="timelogs"
              aria-label={`Semester ${year} Time Logs`}
              title={`Semester ${year} Time Logs`}
              HeadingComponent="div"
            >
              <div className="p-4 text-[#666] font-roboto text-sm">
                (Empty for now)
              </div>
            </AccordionItem>
            <AccordionItem
              key="workschedule"
              aria-label={`Semester ${year} Work Schedule`}
              title={`Semester ${year} Work Schedule`}
              HeadingComponent="div"
            >
              <div className="p-4 text-[#666] font-roboto text-sm">
                (Empty for now)
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Details and Actions – titles centered in each half, then divider, then content */}
        <div className="grid grid-cols-2 gap-x-16 min-w-0">
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

        <div className="grid grid-cols-2 gap-x-16 min-w-0">
          {/* Details section – three accordions */}
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
                        <TableRow
                          label="Name"
                          value={
                            intern
                              ? `${intern.firstName} ${intern.lastName}`.trim() || undefined
                              : undefined
                          }
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Birthday"
                          value={intern ? formatDob(intern.dob) : undefined}
                          skeleton={showSkeleton}
                        />
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            CWID
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div className="flex flex-col gap-2 w-fit">
                                <div
                                  style={{ height: "40px", width: "200px", ...skeletonStyle }}
                                  aria-hidden
                                />
                                <div
                                  style={{ height: "36px", width: "80px", marginTop: 16, ...skeletonStyle }}
                                  aria-hidden
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <input
                                  type="text"
                                  value={cwidValue}
                                  onChange={(e) => setCwidValue(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="CWID"
                                />
                                <button
                                  type="button"
                                  onClick={handleCwidSave}
                                  disabled={cwidSaving}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {cwidSaving ? "Saving…" : "Save"}
                                </button>
                                {cwidError && (
                                  <span className="font-roboto text-red-600 text-sm">
                                    {cwidError}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                        <TableRow
                          label="Email"
                          value={intern?.email ?? undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Phone"
                          value={intern ? formatPhone(intern.phone) : undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Home State/Country"
                          value={intern?.hometown ?? undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Address"
                          value={intern ? formatAddress(intern) : undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Emergency"
                          value={intern ? <EmergencyContent intern={intern} /> : undefined}
                          skeleton={showSkeleton}
                        />
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
                        <TableRow
                          label="School"
                          value={intern?.school ?? undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Major"
                          value={intern?.major ?? undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Minor"
                          value={
                            intern
                              ? (intern.minor?.trim() ? intern.minor : "N/A")
                              : undefined
                          }
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Level"
                          value={intern?.level ?? undefined}
                          skeleton={showSkeleton}
                        />
                        <TableRow
                          label="Graduation"
                          value={intern ? formatGraduation(intern.gradDateIso ?? null) : undefined}
                          skeleton={showSkeleton}
                        />
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
                        {/* Company */}
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Company
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div style={{ height: "24px", width: "200px", ...skeletonStyle }} aria-hidden />
                            ) : !intern?.companyName?.trim() ? (
                              "None"
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <select
                                  value={empCompanyId || undefined}
                                  onChange={(e) => setEmpCompanyId(Number(e.target.value))}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px] bg-white"
                                  aria-label="Company"
                                >
                                  {intern?.companyId != null && !companies.some((c) => c.id === intern.companyId) && (
                                    <option value={intern.companyId}>
                                      {intern.companyName}
                                    </option>
                                  )}
                                  {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={saveCompany}
                                  disabled={empSaving === "company" || empCompanyId === 0 || empCompanyId === intern?.companyId}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {empSaving === "company" ? "Saving…" : "Save"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Department */}
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Department
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div style={{ height: "24px", width: "200px", ...skeletonStyle }} aria-hidden />
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <input
                                  type="text"
                                  value={empDepartment}
                                  onChange={(e) => setEmpDepartment(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Department"
                                />
                                <button
                                  type="button"
                                  onClick={saveDepartment}
                                  disabled={empSaving === "department"}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {empSaving === "department" ? "Saving…" : "Save"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Mentor */}
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Mentor
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div style={{ height: "24px", width: "200px", ...skeletonStyle }} aria-hidden />
                            ) : !intern?.mentorName?.trim() ? (
                              "None"
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <span className="font-roboto text-[14px] text-[#666]">Name:</span>
                                <input
                                  type="text"
                                  value={empMentorName}
                                  onChange={(e) => setEmpMentorName(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Mentor name"
                                />
                                <span className="font-roboto text-[14px] text-[#666]">Title:</span>
                                <input
                                  type="text"
                                  value={empMentorTitle}
                                  onChange={(e) => setEmpMentorTitle(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Mentor title"
                                />
                                <span className="font-roboto text-[14px] text-[#666]">Phone:</span>
                                <input
                                  type="text"
                                  value={empMentorPhone}
                                  onChange={(e) => setEmpMentorPhone(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Mentor phone"
                                />
                                <span className="font-roboto text-[14px] text-[#666]">Email:</span>
                                <input
                                  type="text"
                                  value={empMentorEmail}
                                  onChange={(e) => setEmpMentorEmail(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Mentor email"
                                />
                                <button
                                  type="button"
                                  onClick={saveMentor}
                                  disabled={empSaving === "mentor"}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {empSaving === "mentor" ? "Saving…" : "Save"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Wage */}
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            $
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div style={{ height: "24px", width: "200px", ...skeletonStyle }} aria-hidden />
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={empWage}
                                  onChange={(e) => setEmpWage(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Wage"
                                />
                                <button
                                  type="button"
                                  onClick={saveWage}
                                  disabled={empSaving === "wage"}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {empSaving === "wage" ? "Saving…" : "Save"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Note */}
                        <tr className="font-roboto text-[14px]">
                          <th className="text-left font-bold p-[10px] border border-[#7a0000] bg-[#900] w-[200px] align-top text-white">
                            Note
                          </th>
                          <td className="p-[10px] border border-[#ddd] text-[#666] align-top">
                            {showSkeleton ? (
                              <div style={{ height: "24px", width: "200px", ...skeletonStyle }} aria-hidden />
                            ) : (
                              <div className="flex flex-col gap-2 w-fit">
                                <input
                                  type="text"
                                  value={empNote}
                                  onChange={(e) => setEmpNote(e.target.value)}
                                  className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]"
                                  aria-label="Note"
                                />
                                <button
                                  type="button"
                                  onClick={saveNote}
                                  disabled={empSaving === "note"}
                                  style={{ marginTop: 16 }}
                                  className="inline-flex items-center justify-center w-fit min-w-0 px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {empSaving === "note" ? "Saving…" : "Save"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {empError && (
                          <tr>
                            <td colSpan={2} className="p-[10px] border border-[#ddd] text-red-600 text-sm">
                              {empError}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Actions section – two columns + image placeholder */}
          <div className="min-w-0" style={{ marginLeft: "24px" }}>
            <div className="flex flex-wrap items-start" style={{ gap: "20px" }}>
              <div className="flex flex-col">
                {LEFT_ACTIONS.map(({ label, icon }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <button type="button" className={actionButtonClass}>
                      {icon && <span className="inline-flex shrink-0">{icon}</span>}
                      <span>{label}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                {RIGHT_ACTIONS.map(({ label, icon }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <button type="button" className={actionButtonClass}>
                      {icon && <span className="inline-flex shrink-0">{icon}</span>}
                      <span>{label}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div
                className="flex-shrink-0 w-40 h-40 min-w-[160px] bg-gray-200 rounded-lg flex items-center justify-center text-[#999] font-roboto text-sm"
                aria-hidden
              >
                Image placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
