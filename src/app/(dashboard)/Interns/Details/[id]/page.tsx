"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
  GET_INTERN_DETAIL_API,
  GET_COMPANIES_API,
  PATCH_INTERN_CWID_API,
  PATCH_INTERN_COMPANY_API,
  PATCH_INTERN_DEPARTMENT_API,
  PATCH_INTERN_MENTOR_API,
  PATCH_INTERN_WAGE_API,
  PATCH_INTERN_NOTE_API,
  GET_ME_API,
  getInternTimesheetExportUrl,
  UPDATE_INTERN_RESUME_API,
  UPDATE_INTERN_IMPACT_CALC_API,
  UPDATE_INTERN_PRESENTATION_API,
  type InternDetailItem,
  type CompanyItem,
  type WorkScheduleEntry,
  type TimelogEntry,
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

const RESUME_BLOB_BASE = "https://apcstorage.blob.core.windows.net/resumes";
const IMPACT_CALC_BLOB_BASE = "https://apcstorage.blob.core.windows.net/checklist-impactcalculator";
const PRESENTATION_BLOB_BASE = "https://apcstorage.blob.core.windows.net/checklist-presentation";

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

  const [data, setData] = useState<{
    intern: InternDetailItem;
    workSchedule: WorkScheduleEntry[];
    thisWeek: TimelogEntry[];
    weekStart: string;
    weekEnd: string;
    totalHours: number;
    totalPeriodHours: number;
    totalAllTimeHours: number;
  } | null>(null);
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
  const [roles, setRoles] = useState<string[] | null>(null);
  const updateResumeDisclosure = useDisclosure();
  const [updateResumeLoading, setUpdateResumeLoading] = useState(false);
  const [updateResumeError, setUpdateResumeError] = useState<string | null>(null);
  const [updateResumeSelectedFileName, setUpdateResumeSelectedFileName] = useState<string | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  const updateImpactCalcDisclosure = useDisclosure();
  const [updateImpactCalcLoading, setUpdateImpactCalcLoading] = useState(false);
  const [updateImpactCalcError, setUpdateImpactCalcError] = useState<string | null>(null);
  const [updateImpactCalcSelectedFileName, setUpdateImpactCalcSelectedFileName] = useState<string | null>(null);
  const impactCalcFileInputRef = useRef<HTMLInputElement>(null);

  const updatePresentationDisclosure = useDisclosure();
  const [updatePresentationLoading, setUpdatePresentationLoading] = useState(false);
  const [updatePresentationError, setUpdatePresentationError] = useState<string | null>(null);
  const [updatePresentationSelectedFileName, setUpdatePresentationSelectedFileName] = useState<string | null>(null);
  const presentationFileInputRef = useRef<HTMLInputElement>(null);

  const fetchDetail = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid intern id");
      return;
    }
    setLoading(true);
    setError(null);
    const urlDate =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("date") ?? undefined
        : undefined;
    GET_INTERN_DETAIL_API(id, urlDate)
      .then((res) => {
        if (res.ok) {
          setData({
            intern: res.data.intern,
            workSchedule: res.data.workSchedule ?? [],
            thisWeek: res.data.thisWeek ?? [],
            weekStart: res.data.weekStart,
            weekEnd: res.data.weekEnd,
            totalHours: res.data.totalHours,
            totalPeriodHours: res.data.totalPeriodHours ?? 0,
            totalAllTimeHours: res.data.totalAllTimeHours ?? 0,
          });
          setCwidValue(res.data.intern.cwid ?? "");
        } else {
          setError(res.error ?? "Failed to load intern");
          setData(null);
        }
      })
      .catch(() => setError("Failed to load intern"))
      .finally(() => setLoading(false));
  }, [id]);

  const changeWeek = useCallback(
    (newDate: string) => {
      if (!id) return;
      GET_INTERN_DETAIL_API(id, newDate).then((res) => {
        if (res.ok) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  thisWeek: res.data.thisWeek ?? [],
                  weekStart: res.data.weekStart,
                  weekEnd: res.data.weekEnd,
                  totalHours: res.data.totalHours,
                  totalPeriodHours: res.data.totalPeriodHours ?? 0,
                  totalAllTimeHours: res.data.totalAllTimeHours ?? 0,
                }
              : null
          );
        }
      });
      window.history.replaceState(
        null,
        "",
        `/Interns/Details/${encodeURIComponent(id)}?date=${newDate}`
      );
    },
    [id]
  );

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    GET_COMPANIES_API().then((res) => {
      if (res.ok) setCompanies(res.companies);
    });
  }, []);

  useEffect(() => {
    GET_ME_API().then((res) => {
      if (res.ok) setRoles(res.roles);
      else setRoles([]);
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
            prev ? { ...prev, intern: { ...prev.intern, cwid: cwidValue } } : null
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
            prev ? { ...prev, intern: { ...prev.intern, companyName: name, companyId: empCompanyId } } : null
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
            prev ? { ...prev, intern: { ...prev.intern, department: empDepartment || null } } : null
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
                  ...prev,
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
          setData((prev) => (prev ? { ...prev, intern: { ...prev.intern, wage: num } } : null));
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
          setData((prev) => (prev ? { ...prev, intern: { ...prev.intern, note: empNote || null } } : null));
        } else setEmpError(res.error ?? "Failed to update note");
      })
      .catch(() => setEmpError("Failed to update note"))
      .finally(() => setEmpSaving(null));
  }, [id, empNote]);

  const handleUpdateResumeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!id) return;
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
        const res = await UPDATE_INTERN_RESUME_API(
          id,
          { resumeFileBase64, resumeFileName: file.name },
          { signal: abort.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          updateResumeDisclosure.onClose();
          fetchDetail();
          if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
          setUpdateResumeSelectedFileName(null);
        } else {
          setUpdateResumeError(res.error ?? "Failed to update resume");
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
    [id, fetchDetail, updateResumeDisclosure]
  );

  const handleUpdateImpactCalcClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!id) return;
      const file = impactCalcFileInputRef.current?.files?.[0];
      if (!file || file.size === 0) {
        setUpdateImpactCalcError("Please select a file to upload.");
        return;
      }
      setUpdateImpactCalcError(null);
      setUpdateImpactCalcLoading(true);
      const abort = new AbortController();
      const timeoutId = setTimeout(() => abort.abort(), 120_000);
      try {
        const fileBase64 = await fileToBase64(file);
        const res = await UPDATE_INTERN_IMPACT_CALC_API(
          id,
          { fileBase64, fileName: file.name },
          { signal: abort.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          updateImpactCalcDisclosure.onClose();
          fetchDetail();
          if (impactCalcFileInputRef.current) impactCalcFileInputRef.current.value = "";
          setUpdateImpactCalcSelectedFileName(null);
        } else {
          setUpdateImpactCalcError(res.error ?? "Failed to update impact calculator");
        }
      } catch (err) {
        const isAbort = err instanceof Error && err.name === "AbortError";
        setUpdateImpactCalcError(
          isAbort ? "Upload timed out. Please try again." : "Failed to update impact calculator"
        );
      } finally {
        clearTimeout(timeoutId);
        setUpdateImpactCalcLoading(false);
      }
    },
    [id, fetchDetail, updateImpactCalcDisclosure]
  );

  const handleUpdatePresentationClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!id) return;
      const file = presentationFileInputRef.current?.files?.[0];
      if (!file || file.size === 0) {
        setUpdatePresentationError("Please select a file to upload.");
        return;
      }
      setUpdatePresentationError(null);
      setUpdatePresentationLoading(true);
      const abort = new AbortController();
      const timeoutId = setTimeout(() => abort.abort(), 120_000);
      try {
        const fileBase64 = await fileToBase64(file);
        const res = await UPDATE_INTERN_PRESENTATION_API(
          id,
          { fileBase64, fileName: file.name },
          { signal: abort.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          updatePresentationDisclosure.onClose();
          fetchDetail();
          if (presentationFileInputRef.current) presentationFileInputRef.current.value = "";
          setUpdatePresentationSelectedFileName(null);
        } else {
          setUpdatePresentationError(res.error ?? "Failed to update presentation");
        }
      } catch (err) {
        const isAbort = err instanceof Error && err.name === "AbortError";
        setUpdatePresentationError(
          isAbort ? "Upload timed out. Please try again." : "Failed to update presentation"
        );
      } finally {
        clearTimeout(timeoutId);
        setUpdatePresentationLoading(false);
      }
    },
    [id, fetchDetail, updatePresentationDisclosure]
  );

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
  const rolesLoading = roles === null;
  const canExportTimesheet = !!roles?.some((r) =>
    ["admin", "IT", "staff", "reception"].includes(r)
  );
  const canViewResume = !!roles?.some((r) =>
    ["admin", "IT", "staff", "reception"].includes(r)
  );
  const canUpdateResume = !!roles?.some((r) =>
    ["admin", "IT", "staff"].includes(r)
  );
  const canNewSemester = !!roles?.some((r) =>
    ["admin", "IT"].includes(r)
  );
  const canEditTimelogs = !!roles?.some((r) =>
    ["admin", "IT"].includes(r)
  );
  const canViewImpactCalc = !!roles?.some((r) =>
    ["admin", "IT", "staff", "reception"].includes(r)
  );
  const canUpdateImpactCalc = !!roles?.some((r) =>
    ["admin", "IT", "staff"].includes(r)
  );
  const canViewPresentation = !!roles?.some((r) =>
    ["admin", "IT", "staff", "reception"].includes(r)
  );
  const canUpdatePresentation = !!roles?.some((r) =>
    ["admin", "IT", "staff"].includes(r)
  );

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

        {/* Time Logs / Work Schedule accordions – titles use intern's semester from API */}
        <div className="manage-accordion mb-8">
          <Accordion
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={accordionItemClasses}
          >
            <AccordionItem
              key="timelogs"
              aria-label={
                intern?.semester
                  ? `${intern.semester} Time Logs - ${Number.isInteger(data?.totalAllTimeHours ?? 0) ? String(data?.totalAllTimeHours ?? 0) : (data?.totalAllTimeHours ?? 0).toFixed(2)} Hours`
                  : "Time Logs"
              }
              title={
                <>
                  {intern?.semester ? `${intern.semester} Time Logs` : "Time Logs"}
                  {" - "}
                  <span style={{ color: "#900" }}>
                    {Number.isInteger(data?.totalAllTimeHours ?? 0)
                      ? String(data?.totalAllTimeHours ?? 0)
                      : (data?.totalAllTimeHours ?? 0).toFixed(2)}{" "}
                    Hours
                  </span>
                </>
              }
              HeadingComponent="div"
            >
              <div className="p-4">
                {showSkeleton ? (
                  <div style={{ height: "200px", ...skeletonStyle }} aria-hidden />
                ) : (() => {
                  const weekStartDate = data?.weekStart ? new Date(data.weekStart) : null;
                  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const weekDays = weekStartDate
                    ? Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(weekStartDate);
                        d.setDate(d.getDate() + i);
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        const dateStr = `${y}-${m}-${dd}`;
                        const tl = (data?.thisWeek ?? []).find(
                          (t) => t.start.slice(0, 10) === dateStr
                        );
                        return {
                          dayName: DAY_NAMES[d.getDay()],
                          date: dateStr,
                          displayDate: `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
                          timelog: tl ?? null,
                        };
                      })
                    : [];

                  const isSummer = intern?.semester?.toLowerCase().includes("summer");
                  const maxWeek = isSummer ? 40 : 20;
                  const maxPeriod = isSummer ? 80 : 40;

                  const currentSunday = (() => {
                    const now = new Date();
                    const day = now.getDay();
                    const s = new Date(now);
                    s.setDate(s.getDate() - day);
                    s.setHours(0, 0, 0, 0);
                    return s;
                  })();
                  const showNextWeek = weekStartDate ? weekStartDate < currentSunday : false;
                  const isCurrentWeek =
                    weekStartDate &&
                    currentSunday &&
                    weekStartDate.getFullYear() === currentSunday.getFullYear() &&
                    weekStartDate.getMonth() === currentSunday.getMonth() &&
                    weekStartDate.getDate() === currentSunday.getDate();

                  function formatTimeDisplay(iso: string): string {
                    const d = new Date(iso);
                    const h = d.getUTCHours();
                    const m = d.getUTCMinutes();
                    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    const ampm = h < 12 ? "AM" : "PM";
                    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
                  }

                  function formatLunchDisplay(hours: number): string {
                    if (hours === 0) return "No Lunch";
                    const minutes = Math.round(hours * 60);
                    return `${minutes} min`;
                  }

                  return (
                    <>
                      <div className="flex items-center justify-between mb-3 font-roboto">
                        <button
                          type="button"
                          onClick={() => {
                            if (!weekStartDate) return;
                            const prev = new Date(weekStartDate);
                            prev.setDate(prev.getDate() - 7);
                            const y = prev.getFullYear();
                            const m = String(prev.getMonth() + 1).padStart(2, "0");
                            const dd = String(prev.getDate()).padStart(2, "0");
                            changeWeek(`${y}-${m}-${dd}`);
                          }}
                          className={backButtonClass + " no-underline"}
                        >
                          &laquo;&laquo; Prev Week
                        </button>
                        {showNextWeek && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!weekStartDate) return;
                              const next = new Date(weekStartDate);
                              next.setDate(next.getDate() + 7);
                              const y = next.getFullYear();
                              const m = String(next.getMonth() + 1).padStart(2, "0");
                              const dd = String(next.getDate()).padStart(2, "0");
                              changeWeek(`${y}-${m}-${dd}`);
                            }}
                            className={backButtonClass + " no-underline"}
                          >
                            Next Week &raquo;&raquo;
                          </button>
                        )}
                      </div>

                      <div style={{ height: "12px" }} aria-hidden />

                      <table className="w-full max-w-full border-collapse font-roboto text-sm">
                        <thead>
                          <tr className="bg-[#9E1B32]">
                            <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Date</th>
                            <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start</th>
                            <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End</th>
                            <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Lunch</th>
                            <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Description</th>
                            {canEditTimelogs && (
                              <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {weekDays.map((day) => (
                            <tr key={day.date} className="bg-white hover:bg-[#f5f5f5]">
                              <td className="border border-[#ddd] p-[10px] text-[#666] text-center whitespace-nowrap">
                                {day.dayName} {day.displayDate}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                                {day.timelog ? formatTimeDisplay(day.timelog.start) : "—"}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                                {day.timelog ? formatTimeDisplay(day.timelog.end) : "—"}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                                {day.timelog ? formatLunchDisplay(day.timelog.lunch) : "—"}
                              </td>
                              <td className="border border-[#ddd] p-[10px] text-[#666] text-left">
                                {day.timelog?.description ?? ""}
                              </td>
                              {canEditTimelogs && (
                                <td className="border border-[#ddd] p-[10px] text-center">
                                  {day.timelog ? (
                                    <Link
                                      href={`/Time/Edit/${encodeURIComponent(id)}?date=${day.date}`}
                                      className="text-[#CC6600] no-underline hover:no-underline text-xl"
                                      title="Edit"
                                    >
                                      &#9998;
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/Time/Create/${encodeURIComponent(id)}?date=${day.date}`}
                                      className="text-[#228B22] no-underline hover:no-underline text-xl font-bold"
                                      title="Add"
                                    >
                                      +
                                    </Link>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-3 flex items-center justify-between font-roboto" style={{ fontSize: "14px", color: "#900" }}>
                        <span style={{ fontWeight: 700 }}>
                          {isCurrentWeek ? `${Number.isInteger(data?.totalPeriodHours ?? 0) ? String(data?.totalPeriodHours ?? 0) : (data?.totalPeriodHours ?? 0).toFixed(2)} Hours This Period` : "\u00A0"}
                        </span>
                        <span style={{ fontWeight: 700 }}>
                          {Number.isInteger(data?.totalHours ?? 0) ? String(data?.totalHours ?? 0) : (data?.totalHours ?? 0).toFixed(2)} Hours This Week
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </AccordionItem>
            <AccordionItem
              key="workschedule"
              aria-label={intern?.semester ? `${intern.semester} Work Schedule` : "Work Schedule"}
              title={intern?.semester ? `${intern.semester} Work Schedule` : "Work Schedule"}
              HeadingComponent="div"
            >
              <div className="p-4">
                {showSkeleton ? (
                  <div style={{ height: "200px", ...skeletonStyle }} aria-hidden />
                ) : (
                  <table className="w-full max-w-full border-collapse font-roboto text-sm">
                    <thead>
                      <tr className="bg-[#9E1B32]">
                        <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Day</th>
                        <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start Time</th>
                        <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End Time</th>
                        <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start Time</th>
                        <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.workSchedule ?? []).map((ws) => (
                        <tr key={ws.day} className="bg-white hover:bg-[#f5f5f5]">
                          <td className="border border-[#ddd] p-[10px] text-[#666] text-center">{ws.day}</td>
                          <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                            {ws.startDisplay || "—"}
                          </td>
                          <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                            {ws.endDisplay || "—"}
                          </td>
                          <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                            {ws.start2Display || "—"}
                          </td>
                          <td className="border border-[#ddd] p-[10px] text-[#666] text-center">
                            {ws.end2Display || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
                    {label === "Export Timesheet" ? (
                      rolesLoading || !id ? (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : canExportTimesheet ? (
                        <a
                          href={getInternTimesheetExportUrl(id)}
                          className={actionButtonClass}
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </a>
                      ) : null
                    ) : label === "Update Resume" ? (
                      rolesLoading || !id ? (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
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
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      )
                    ) : label === "Update Impact Calc" ? (
                      rolesLoading || !id ? (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : canUpdateImpactCalc ? (
                        <button
                          type="button"
                          className={actionButtonClass}
                          onClick={() => {
                            setUpdateImpactCalcError(null);
                            setUpdateImpactCalcSelectedFileName(null);
                            if (impactCalcFileInputRef.current) impactCalcFileInputRef.current.value = "";
                            updateImpactCalcDisclosure.onOpen();
                          }}
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      )
                    ) : label === "Update Presentation" ? (
                      rolesLoading || !id ? (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : canUpdatePresentation ? (
                        <button
                          type="button"
                          className={actionButtonClass}
                          onClick={() => {
                            setUpdatePresentationError(null);
                            setUpdatePresentationSelectedFileName(null);
                            if (presentationFileInputRef.current) presentationFileInputRef.current.value = "";
                            updatePresentationDisclosure.onOpen();
                          }}
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      )
                    ) : label === "New Semester" ? (
                      rolesLoading || !id ? (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </button>
                      ) : canNewSemester ? (
                        <Link
                          href={`/Interns/ReturningIntern/${encodeURIComponent(id)}`}
                          className={actionButtonClass + " no-underline"}
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{label}</span>
                        </Link>
                      ) : null
                    ) : (
                      <button type="button" className={actionButtonClass}>
                        {icon && <span className="inline-flex shrink-0">{icon}</span>}
                        <span>{label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                {RIGHT_ACTIONS.map(({ label, icon }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    {label === "View Resume" ? (() => {
                      const rid = intern?.resumeId?.trim() ?? "";
                      const hasValidResume = rid.length > 15;
                      const displayLabel = rid ? "View Resume" : "Resume";
                      if (rolesLoading || !id) {
                        return (
                          <button
                            type="button"
                            className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                            disabled
                            aria-disabled="true"
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>View Resume</span>
                          </button>
                        );
                      }
                      if (canViewResume && hasValidResume) {
                        return (
                          <a
                            href={`${RESUME_BLOB_BASE}/${encodeURIComponent(rid)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={actionButtonClass}
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>{displayLabel}</span>
                          </a>
                        );
                      }
                      return (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>{displayLabel}</span>
                        </button>
                      );
                    })() : label === "Impact Calculator" ? (() => {
                      const icId = intern?.impactCalcId?.trim() ?? "";
                      const hasValid = icId.length > 15;
                      if (rolesLoading || !id) {
                        return (
                          <button
                            type="button"
                            className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                            disabled
                            aria-disabled="true"
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>Impact Calculator</span>
                          </button>
                        );
                      }
                      if (canViewImpactCalc && hasValid) {
                        return (
                          <a
                            href={`${IMPACT_CALC_BLOB_BASE}/${encodeURIComponent(icId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={actionButtonClass}
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>Impact Calculator</span>
                          </a>
                        );
                      }
                      return (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>Impact Calculator</span>
                        </button>
                      );
                    })() : label === "Presentation" ? (() => {
                      const pId = intern?.presentationId?.trim() ?? "";
                      const hasValid = pId.length > 15;
                      if (rolesLoading || !id) {
                        return (
                          <button
                            type="button"
                            className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                            disabled
                            aria-disabled="true"
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>Presentation</span>
                          </button>
                        );
                      }
                      if (canViewPresentation && hasValid) {
                        return (
                          <a
                            href={`${PRESENTATION_BLOB_BASE}/${encodeURIComponent(pId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={actionButtonClass}
                          >
                            {icon && <span className="inline-flex shrink-0">{icon}</span>}
                            <span>Presentation</span>
                          </a>
                        );
                      }
                      return (
                        <button
                          type="button"
                          className={actionButtonClass + " opacity-60 cursor-not-allowed"}
                          disabled
                          aria-disabled="true"
                        >
                          {icon && <span className="inline-flex shrink-0">{icon}</span>}
                          <span>Presentation</span>
                        </button>
                      );
                    })() : (
                      <button type="button" className={actionButtonClass}>
                        {icon && <span className="inline-flex shrink-0">{icon}</span>}
                        <span>{label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {(() => {
                const cwid = intern?.cwid?.trim() ?? "";
                const phone = intern?.phone?.replace(/\D/g, "") ?? "";
                const hasCustomHeadshot = !!cwid && !!phone;
                const candidates = hasCustomHeadshot
                  ? [
                      `/images/InternHeadshots/${encodeURIComponent(phone)}.jpg`,
                      `/images/InternHeadshots/${encodeURIComponent(phone)}.JPG`,
                      `/images/InternHeadshots/${encodeURIComponent(phone)}.jpeg`,
                      "/images/InternHeadshots/default.jpg",
                    ]
                  : ["/images/InternHeadshots/default.jpg"];
                const src = candidates[0];
                return (
                  <img
                    key={candidates.join("|")}
                    src={src}
                    alt={intern ? `${intern.firstName} ${intern.lastName}`.trim() : "Intern headshot"}
                    width={300}
                    height={300}
                    className="flex-shrink-0 rounded-lg object-cover"
                    style={{ width: 300, height: 300 }}
                    onError={(e) => {
                      const img = e.currentTarget;
                      let currentPath = img.getAttribute("src") ?? "";
                      try {
                        currentPath = new URL(img.src).pathname;
                      } catch {
                        // Keep relative src when URL parsing is unavailable.
                      }
                      const currentIndex = candidates.findIndex((candidate) =>
                        currentPath.endsWith(candidate)
                      );
                      const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
                      if (nextIndex < candidates.length) {
                        img.src = candidates[nextIndex];
                      }
                    }}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={updateResumeDisclosure.isOpen}
        onClose={() => {
          updateResumeDisclosure.onClose();
          setUpdateResumeError(null);
          setUpdateResumeSelectedFileName(null);
          if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Update Resume</ModalHeader>
              <ModalBody>
                <div>
                  <input
                    ref={resumeFileInputRef}
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    aria-label="Resume file"
                    className="font-roboto text-[14px]"
                    onChange={(e) =>
                      setUpdateResumeSelectedFileName(e.target.files?.[0]?.name ?? null)
                    }
                  />
                  <p className="font-roboto text-[14px] text-[#666] mt-1">
                    {updateResumeSelectedFileName ? (
                      <span className="text-green-700">
                        File chosen: {updateResumeSelectedFileName}
                      </span>
                    ) : (
                      <span>No file chosen</span>
                    )}
                  </p>
                  {updateResumeError && (
                    <p className="font-roboto text-sm text-red-600 mt-1">{updateResumeError}</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  type="button"
                  disabled={updateResumeLoading}
                  onClick={handleUpdateResumeClick}
                  className="inline-flex items-center px-4 py-2 border border-[#ccc] rounded-lg bg-white text-sm font-roboto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateResumeLoading ? "Updating…" : "Update"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={updateImpactCalcDisclosure.isOpen}
        onClose={() => {
          updateImpactCalcDisclosure.onClose();
          setUpdateImpactCalcError(null);
          setUpdateImpactCalcSelectedFileName(null);
          if (impactCalcFileInputRef.current) impactCalcFileInputRef.current.value = "";
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Update Impact Calc</ModalHeader>
              <ModalBody>
                <div>
                  <input
                    ref={impactCalcFileInputRef}
                    type="file"
                    name="impactCalc"
                    aria-label="Impact calculator file"
                    className="font-roboto text-[14px]"
                    onChange={(e) =>
                      setUpdateImpactCalcSelectedFileName(e.target.files?.[0]?.name ?? null)
                    }
                  />
                  <p className="font-roboto text-[14px] text-[#666] mt-1">
                    {updateImpactCalcSelectedFileName ? (
                      <span className="text-green-700">
                        File chosen: {updateImpactCalcSelectedFileName}
                      </span>
                    ) : (
                      <span>No file chosen</span>
                    )}
                  </p>
                  {updateImpactCalcError && (
                    <p className="font-roboto text-sm text-red-600 mt-1">{updateImpactCalcError}</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  type="button"
                  disabled={updateImpactCalcLoading}
                  onClick={handleUpdateImpactCalcClick}
                  className="inline-flex items-center px-4 py-2 border border-[#ccc] rounded-lg bg-white text-sm font-roboto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateImpactCalcLoading ? "Updating…" : "Update"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={updatePresentationDisclosure.isOpen}
        onClose={() => {
          updatePresentationDisclosure.onClose();
          setUpdatePresentationError(null);
          setUpdatePresentationSelectedFileName(null);
          if (presentationFileInputRef.current) presentationFileInputRef.current.value = "";
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Update Presentation</ModalHeader>
              <ModalBody>
                <div>
                  <input
                    ref={presentationFileInputRef}
                    type="file"
                    name="presentation"
                    aria-label="Presentation file"
                    className="font-roboto text-[14px]"
                    onChange={(e) =>
                      setUpdatePresentationSelectedFileName(e.target.files?.[0]?.name ?? null)
                    }
                  />
                  <p className="font-roboto text-[14px] text-[#666] mt-1">
                    {updatePresentationSelectedFileName ? (
                      <span className="text-green-700">
                        File chosen: {updatePresentationSelectedFileName}
                      </span>
                    ) : (
                      <span>No file chosen</span>
                    )}
                  </p>
                  {updatePresentationError && (
                    <p className="font-roboto text-sm text-red-600 mt-1">{updatePresentationError}</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  type="button"
                  disabled={updatePresentationLoading}
                  onClick={handleUpdatePresentationClick}
                  className="inline-flex items-center px-4 py-2 border border-[#ccc] rounded-lg bg-white text-sm font-roboto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatePresentationLoading ? "Updating…" : "Update"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
