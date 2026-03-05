/**
 * Centralized API: paths and callable APIs.
 * Use LOGIN_API, GET_ME_API, LOGOUT_API in components instead of calling fetch directly.
 */
const base = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API = {
  auth: {
    login: `${base}/api/auth/login`,
    me: `${base}/api/auth/me`,
    logout: `${base}/api/auth/logout`,
  },
  interns: `${base}/api/interns`,
  charts: `${base}/api/charts`,
  companies: `${base}/api/companies`,
  presentations: `${base}/api/presentations`,
  services: `${base}/api/services`,
  users: `${base}/api/users`,
  classesRegistrants: `${base}/api/classes/registrants`,
  pastInterns: `${base}/api/past-interns`,
  archiveExportPastIntern: `${base}/api/archive/export-past-intern`,
  internsWorkSchedules: `${base}/api/interns/work-schedules`,
  archiveExportInternSchedules: `${base}/api/archive/export-intern-schedules`,
  archiveExportInternTimesheet: `${base}/api/archive/export-intern-timesheet`,
} as const;

const defaultFetchOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

/** Call this to log in. Returns { ok, user, roles } on success or { ok: false, error } on failure. */
export async function LOGIN_API(credentials: {
  username: string;
  password: string;
  rememberMe?: boolean;
}): Promise<
  | { ok: true; user: { id: string; userName: string; firstName: string | null; lastName: string | null }; roles: string[] }
  | { ok: false; error: string }
> {
  const res = await fetch(API.auth.login, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(credentials),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error =
      res.status === 401 ? "Invalid username or password." : (data?.error as string) ?? "An error occurred. Please try again.";
    return { ok: false, error };
  }
  return { ok: true, user: data.user, roles: data.roles };
}

/** Call this to get the current user (requires session cookie). */
export async function GET_ME_API(): Promise<
  | { ok: true; user: { id: string; userName: string; firstName: string | null; lastName: string | null; email: string | null }; roles: string[] }
  | { ok: false; error: string }
> {
  const res = await fetch(API.auth.me, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: (data?.error as string) ?? "Unauthorized" };
  return { ok: true, user: data.user, roles: data.roles };
}

/** Call this to log out. */
export async function LOGOUT_API(): Promise<{ ok: boolean }> {
  const res = await fetch(API.auth.logout, { ...defaultFetchOptions, method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && (data?.ok === true) };
}

/** Chart data: 2D array, first row = headers, rest = [label, number]. */
export type ChartData = (string | number)[][];

export type ChartsResponse = {
  pastInternsByMajorData: ChartData;
  internsByMajorData: ChartData;
  pastInternsByCompanyData: ChartData;
  internsByCompanyData: ChartData;
  pastHrsByCompanyData: ChartData;
  hrsByCompanyData: ChartData;
};

/** Call this to get all chart datasets (requires admin, IT, or staff). */
export async function GET_CHARTS_API(): Promise<
  | { ok: true; data: ChartsResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.charts, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load charts",
      status: res.status,
    };
  }
  return { ok: true, data: data as ChartsResponse };
}

/** Presentation item from DB (for accordion sections and tables). */
export type PresentationItem = {
  id: string;
  name: string;
  semester: string;
  semesterLabel: string;
  uploadDate: string;
  uploader: string;
  company: string;
};

/** Call this to get all presentations ordered by Semester desc (distinct semesters = accordion sections). */
export async function GET_PRESENTATIONS_API(): Promise<
  | { ok: true; presentations: PresentationItem[] }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.presentations, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load presentations",
      status: res.status,
    };
  }
  return { ok: true, presentations: data as PresentationItem[] };
}

/** Professional Services (projects) item: accordion rows grouped by Season. */
export type ServiceItem = {
  id: number;
  typeOfService: string;
  companyAbbreviation: string;
  staffMember: string;
  startDate: string;
  completed: boolean;
  certificate: boolean;
  season: string;
};

/** Call this to get all services ordered by StartDate desc (distinct Season = accordion titles). */
export async function GET_SERVICES_API(): Promise<
  | { ok: true; services: ServiceItem[] }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.services, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load services",
      status: res.status,
    };
  }
  return { ok: true, services: data as ServiceItem[] };
}

/** Class registrant row (all ClassRegs, order determined by sortBy on API). */
export type ClassRegItem = {
  id: number;
  dateApplied: string;
  class: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
};

/** Call this to get class registrants. sortBy: "Class" | "Company" | "LastName" or omit for recent (DateApplied desc). */
export async function GET_CLASS_REGISTRANTS_API(sortBy?: string): Promise<
  | { ok: true; registrants: ClassRegItem[] }
  | { ok: false; error: string; status?: number }
> {
  const url = sortBy
    ? `${API.classesRegistrants}?${new URLSearchParams({ sortBy }).toString()}`
    : API.classesRegistrants;
  const res = await fetch(url, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load class registrants",
      status: res.status,
    };
  }
  return { ok: true, registrants: data as ClassRegItem[] };
}

/** Work schedule row for ScheduleDisplay (weekday only). Times are in org timezone (America/Chicago). */
export type WorkScheduleDisplayItem = {
  id: string;
  dayOfWeek: number;
  firstName: string;
  lastName: string;
  companyName: string;
  startDisplay: string;
  endDisplay: string;
  start2Display: string | null;
  end2Display: string | null;
};

export type WorkSchedulesResponse = {
  daysOfWeek: string[];
  workSchedules: WorkScheduleDisplayItem[];
};

/** Call this to get weekday work schedules for Intern Schedules page (IT, admin, staff). */
export async function GET_WORK_SCHEDULES_API(): Promise<
  | { ok: true; data: WorkSchedulesResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.internsWorkSchedules, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load work schedules",
      status: res.status,
    };
  }
  return { ok: true, data: data as WorkSchedulesResponse };
}

/** URL for "Semester Schedules" export (GET returns file). */
export function getInternSchedulesExportUrl(): string {
  return API.archiveExportInternSchedules;
}

/** URL for "Export Timesheet" on Intern Details (GET returns file). */
export function getInternTimesheetExportUrl(internId: string): string {
  const id = internId.trim();
  if (!id) return API.archiveExportInternTimesheet;
  const qs = new URLSearchParams({ id }).toString();
  return `${API.archiveExportInternTimesheet}?${qs}`;
}

/** Current intern row for the Interns table (sortby applied on server). */
export type InternListItem = {
  id: string;
  cwid: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  companyName: string;
  semester: string;
  level: string | null;
  gradDate: string;
  wage: number;
  dob: string;
  hoursThisWeek: number;
  hoursBar: number;
  nameStyle: "text-bold" | "text-normal";
  companyStyle: "text-bold" | "text-normal";
};

/** Response from GET /api/interns (list with weekStart and isSummer for bar/flag). */
export type InternsListResponse = {
  interns: InternListItem[];
  weekStart: string;
  isSummer: boolean;
};

/** sortby: "lastname" | "company" | "hours" | "graddate" (or default lastname). */
export async function GET_INTERNS_API(sortby?: string): Promise<
  | { ok: true; data: InternsListResponse }
  | { ok: false; error: string; status?: number }
> {
  const url = sortby
    ? `${API.interns}?${new URLSearchParams({ sortby }).toString()}`
    : API.interns;
  const res = await fetch(url, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load interns",
      status: res.status,
    };
  }
  return { ok: true, data: data as InternsListResponse };
}

/** Timelog row for Intern Details week view. */
export type TimelogEntry = {
  id: string;
  start: string;
  end: string;
  description: string | null;
  lunch: number;
  hours: number;
};

/** Current intern detail (for Details page). */
export type InternDetailItem = {
  id: string;
  cwid: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  companyName: string;
  /** Company id for Employment dropdown (user's CompanyId). */
  companyId: number | null;
  semester: string;
  level: string | null;
  gradDate: string;
  /** ISO date for School Graduation (MMM yyyy). */
  gradDateIso: string | null;
  wage: number;
  dob: string;
  major: string | null;
  minor: string | null;
  school: string | null;
  department: string | null;
  mentorName: string | null;
  mentorTitle: string | null;
  mentorPhone: string | null;
  mentorEmail: string | null;
  note: string | null;
  /** Personal section */
  street: string | null;
  apt: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  hometown: string | null;
  contactName: string | null;
  contactRelationship: string | null;
  contactPhone: string | null;
  /** Blob name in resumes container (length > 15 = valid link). */
  resumeId: string | null;
  /** Blob name in checklist-impactcalculator container (length > 15 = valid link). */
  impactCalcId: string | null;
  /** Blob name in checklist-presentation container (length > 15 = valid link). */
  presentationId: string | null;
};

/** Work schedule entry for a single day (Mon–Fri) on Intern Details. */
export type WorkScheduleEntry = {
  day: string;
  startDisplay: string;
  endDisplay: string;
  start2Display: string | null;
  end2Display: string | null;
};

/** Response from GET /api/interns/[id] (optional ?date=yyyy-MM-dd for week). */
export type InternDetailsResponse = {
  intern: InternDetailItem;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalPeriodHours: number;
  totalAllTimeHours: number;
  thisWeek: TimelogEntry[];
  workSchedule: WorkScheduleEntry[];
};

/** Get one intern's details and week timelogs. date = yyyy-MM-dd (Sunday of week); omit for current week. */
export async function GET_INTERN_DETAIL_API(
  id: string,
  date?: string
): Promise<
  | { ok: true; data: InternDetailsResponse }
  | { ok: false; error: string; status?: number }
> {
  const url = date
    ? `${API.interns}/${encodeURIComponent(id)}?${new URLSearchParams({ date }).toString()}`
    : `${API.interns}/${encodeURIComponent(id)}`;
  const res = await fetch(url, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load intern details",
      status: res.status,
    };
  }
  return { ok: true, data: data as InternDetailsResponse };
}

/** Update intern CWID (IT only). PATCH /api/interns/[id]/cwid with body { cwid: string }. */
export async function PATCH_INTERN_CWID_API(
  id: string,
  cwid: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/cwid`, {
    ...defaultFetchOptions,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cwid }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update CWID",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update intern's company (user's CompanyId). PATCH /api/interns/[id]/company with body { companyId: number }. */
export async function PATCH_INTERN_COMPANY_API(
  id: string,
  companyId: number
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/company`, {
    ...defaultFetchOptions,
    method: "PATCH",
    body: JSON.stringify({ companyId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update company",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update intern department. PATCH /api/interns/[id]/department with body { department: string }. */
export async function PATCH_INTERN_DEPARTMENT_API(
  id: string,
  department: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/department`, {
    ...defaultFetchOptions,
    method: "PATCH",
    body: JSON.stringify({ department }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update department",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update intern mentor. PATCH /api/interns/[id]/mentor with body { mentorName?, mentorTitle?, mentorPhone?, mentorEmail? }. */
export async function PATCH_INTERN_MENTOR_API(
  id: string,
  payload: { mentorName?: string; mentorTitle?: string; mentorPhone?: string; mentorEmail?: string }
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/mentor`, {
    ...defaultFetchOptions,
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update mentor",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update intern wage. PATCH /api/interns/[id]/wage with body { wage: number }. */
export async function PATCH_INTERN_WAGE_API(
  id: string,
  wage: number
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/wage`, {
    ...defaultFetchOptions,
    method: "PATCH",
    body: JSON.stringify({ wage }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update wage",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update intern note. PATCH /api/interns/[id]/note with body { note: string }. */
export async function PATCH_INTERN_NOTE_API(
  id: string,
  note: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/note`, {
    ...defaultFetchOptions,
    method: "PATCH",
    body: JSON.stringify({ note }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update note",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Upload resume file for intern (admin, IT, staff). POST JSON with base64 file data. */
export async function UPDATE_INTERN_RESUME_API(
  id: string,
  payload: { resumeFileBase64: string; resumeFileName: string },
  options?: { signal?: AbortSignal }
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/resume`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update resume",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Upload impact calc file for intern (admin, IT, staff). POST JSON with base64 file data. */
export async function UPDATE_INTERN_IMPACT_CALC_API(
  id: string,
  payload: { fileBase64: string; fileName: string },
  options?: { signal?: AbortSignal }
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/impact-calc`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update impact calculator",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Upload presentation file for intern (admin, IT, staff). POST JSON with base64 file data. */
export async function UPDATE_INTERN_PRESENTATION_API(
  id: string,
  payload: { fileBase64: string; fileName: string },
  options?: { signal?: AbortSignal }
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/presentation`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update presentation",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Payload for New Semester (Returning Intern). */
export type NewSemesterPayload = {
  semesterSeason: "April" | "July" | "November";
  semesterYear: number;
  wage: number;
  companyId: number;
};

/** Archive current stint as PastIntern and update intern for new semester (admin, IT). */
export async function POST_INTERN_NEW_SEMESTER_API(
  id: string,
  payload: NewSemesterPayload
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/new-semester`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to process new semester",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Download intern timesheet (Excel-style) before archiving. Call this before POST_INTERN_ARCHIVE_API / POST_INTERN_TO_APPLICANT_API so data still exists. */
export async function DOWNLOAD_INTERN_TIMESHEET_API(
  internId: string
): Promise<{ ok: true; filename?: string } | { ok: false; error: string }> {
  const url = `${API.archiveExportInternTimesheet}?${new URLSearchParams({ id: internId }).toString()}`;
  const res = await fetch(url, { credentials: "include", method: "GET" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: (data?.error as string) ?? "Failed to export timesheet" };
  }
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^";\n]+)"?/);
  const filename = match?.[1]?.trim() ?? `Timelog-${internId}-${new Date().toISOString().slice(0, 10)}.xls`;
  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
  return { ok: true, filename };
}

/** Archive intern: snapshot to PastIntern, delete timelogs/schedules/intern/user. IT only. */
export async function POST_INTERN_ARCHIVE_API(
  id: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/archive`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to archive intern",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Send intern to applicant pool: PastIntern + Applicant (PrevIntern=true), delete timelogs/schedules/intern/user. IT only. */
export async function POST_INTERN_TO_APPLICANT_API(
  id: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(id)}/to-applicant`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to send intern to applicant pool",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Payload for creating a timelog. */
export type CreateTimelogPayload = {
  date: string;
  startTime: string;
  endTime: string;
  lunch: number;
  description: string;
};

/** Payload for editing a timelog. */
export type EditTimelogPayload = CreateTimelogPayload & {
  timelogId: string;
};

/** Create a new timelog for an intern. */
export async function CREATE_TIMELOG_API(
  internId: string,
  payload: CreateTimelogPayload
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(internId)}/timelog`, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to create timelog",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Update an existing timelog for an intern. */
export async function UPDATE_TIMELOG_API(
  internId: string,
  payload: EditTimelogPayload
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.interns}/${encodeURIComponent(internId)}/timelog`, {
    ...defaultFetchOptions,
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update timelog",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Delete the timelog for an intern on the given date (yyyy-MM-dd). */
export async function DELETE_TIMELOG_API(
  internId: string,
  date: string
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(
    `${API.interns}/${encodeURIComponent(internId)}/timelog?${new URLSearchParams({ date }).toString()}`,
    { ...defaultFetchOptions, method: "DELETE" }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete timelog",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Past intern list item (for accordion table rows). */
export type PastInternItem = {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  school: string;
  semester: string;
  semesterLabel: string;
  midSemReportId: string | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

/** Past intern index response: semesters (labels, newest first) and grouped lists. */
export type PastInternsIndexResponse = {
  semesters: string[];
  pastInternsGroupedBySemester: PastInternItem[][];
};

/** Call this to get past interns grouped by semester (IT, admin, staff, reception). */
export async function GET_PAST_INTERNS_API(): Promise<
  | { ok: true; data: PastInternsIndexResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.pastInterns, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load past interns",
      status: res.status,
    };
  }
  return { ok: true, data: data as PastInternsIndexResponse };
}

/** Past intern detail (for Details page). */
export type PastInternDetailItem = {
  id: number;
  cwid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  apt: string;
  gradDate: string;
  major: string;
  minor: string;
  level: string;
  semester: string;
  semesterLabel: string;
  company: string;
  school: string;
  wage: number;
  hrsWorked: number;
  mentorName: string;
  mentorPhone: string;
  mentorEmail: string;
  mentorTitle: string;
  note: string;
  hometown: string;
  hearAboutUs: string;
  midSemReportId: string | null;
  impactCalcId: string | null;
  presentationId: string | null;
};

/** Call this to get one past intern by id (for Details page). */
export async function GET_PAST_INTERN_BY_ID_API(id: number): Promise<
  | { ok: true; pastIntern: PastInternDetailItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.pastInterns}/${id}`, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Past intern not found",
      status: res.status,
    };
  }
  return { ok: true, pastIntern: data as PastInternDetailItem };
}

/** Call this to delete a past intern (IT only). */
export async function DELETE_PAST_INTERN_API(id: number): Promise<
  { ok: true } | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.pastInterns}/${id}`, {
    ...defaultFetchOptions,
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete past intern",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Build export ATN report URL for a semester (date as yyyy-MM-dd). */
export function getPastInternExportUrl(semesterDateIso: string): string {
  const yyyyMmDd = semesterDateIso.slice(0, 10);
  return `${API.archiveExportPastIntern}?thisSemester=${encodeURIComponent(yyyyMmDd)}`;
}

/** Single service for Details/Edit (full company name and all fields). */
export type ServiceDetailItem = {
  id: number;
  companyId: number | null;
  typeOfService: string;
  companyName: string;
  staffMember: string;
  fieldStaff: number;
  county: string;
  numberEmployeesTrained: number;
  certificate: boolean;
  numberInterns: number;
  startDate: string;
  endDate: string;
  completed: boolean;
};

/** Payload for updating a service (PUT /api/services/[id]). */
export type UpdateServicePayload = {
  typeOfService: string;
  staffMember: string;
  fieldStaff: number;
  county: string;
  numberEmployeesTrained: number;
  numberInterns: number;
  companyId: number;
  completed: boolean;
  certificate: boolean;
  startDateMonth: number;
  semesterYear: number;
  endDateMonth: number;
  semesterYearEnd: number;
};

/** Payload for creating a service (POST /api/services). Completed and Certificate are set to false. */
export type CreateServicePayload = {
  typeOfService: string;
  staffMember: string;
  fieldStaff: number;
  county: string;
  numberEmployeesTrained: number;
  numberInterns: number;
  companyId: number;
  startDateMonth: number;
  semesterYear: number;
  endDateMonth: number;
  semesterYearEnd: number;
};

/** Call this to get one service by id (for Details page). Returns 404 if not found. */
export async function GET_SERVICE_BY_ID_API(id: number): Promise<
  | { ok: true; service: ServiceDetailItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.services}/${id}`, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Service not found",
      status: res.status,
    };
  }
  return { ok: true, service: data as ServiceDetailItem };
}

/** Call this to update a service (PUT). Redirect to Details on success. */
export async function UPDATE_SERVICE_API(
  id: number,
  payload: UpdateServicePayload
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const res = await fetch(`${API.services}/${id}`, {
    ...defaultFetchOptions,
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update service",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Call this to create a service (POST). Redirect to /Services on success. */
export async function CREATE_SERVICE_API(
  payload: CreateServicePayload
): Promise<{ ok: true; id: number } | { ok: false; error: string; status?: number }> {
  const res = await fetch(API.services, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to create service",
      status: res.status,
    };
  }
  const id = typeof data?.id === "number" ? data.id : 0;
  return { ok: true, id };
}

/** Call this to delete a service. Returns 404 if not found. Redirect to /Services on success. */
export async function DELETE_SERVICE_API(
  id: number
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const res = await fetch(`${API.services}/${id}`, {
    ...defaultFetchOptions,
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete service",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Payload for creating a presentation (JSON body with base64 file to avoid multipart handling issues). */
export type CreatePresentationPayload = {
  presentationFileBase64: string;
  presentationFileName: string;
  presentationName: string;
  companyId: string | number;
  presentationSeason: string;
  presentationYear: string;
};

/** Call this to create a presentation (IT only). Sends JSON with base64-encoded file. */
export async function CREATE_PRESENTATION_API(
  payload: CreatePresentationPayload,
  options?: { signal?: AbortSignal }
): Promise<
  | { ok: true; id: string }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.presentations, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to upload presentation",
      status: res.status,
    };
  }
  const id = (data as { id?: string }).id;
  if (typeof id !== "string") {
    return {
      ok: false,
      error: (data?.error as string) ?? "Invalid response from server",
      status: res.status,
    };
  }
  return { ok: true, id };
}

/** Company list item (Name and Abbreviation from DB). */
export type CompanyItem = { id: number; name: string; abbreviation: string };

/** Call this to get the companies list, ordered by name. */
export async function GET_COMPANIES_API(): Promise<
  | { ok: true; companies: CompanyItem[] }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.companies, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load companies",
      status: res.status,
    };
  }
  return { ok: true, companies: data as CompanyItem[] };
}

/** Call this to get one company for the Edit form. */
export async function GET_COMPANY_API(id: number): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to create a company. */
export async function CREATE_COMPANY_API(body: {
  name: string;
  abbreviation: string;
}): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.companies, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to create company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to update a company. */
export async function UPDATE_COMPANY_API(
  id: number,
  body: { name: string; abbreviation: string }
): Promise<
  | { ok: true; company: CompanyItem }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, {
    ...defaultFetchOptions,
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update company",
      status: res.status,
    };
  }
  return { ok: true, company: data as CompanyItem };
}

/** Call this to delete a company. */
export async function DELETE_COMPANY_API(id: number): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.companies}/${id}`, {
    ...defaultFetchOptions,
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete company",
      status: res.status,
    };
  }
  return { ok: true };
}

/** User row for the Manage Users table (by role). canDelete is false when user has an associated Intern. */
export type UserListItem = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  canDelete: boolean;
};

const USERS_BY_ROLE_KEYS = [
  "accountant",
  "admin",
  "advisor",
  "client",
  "IT",
  "staff",
  "intern",
  "reception",
] as const;

export type UsersByRoleResponse = {
  byRole: Record<(typeof USERS_BY_ROLE_KEYS)[number], UserListItem[]>;
  usersWithoutRole: UserListItem[];
};

/** Call this to get all users grouped by role (admin/IT only). */
export async function GET_USERS_API(): Promise<
  | { ok: true; data: UsersByRoleResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.users, { ...defaultFetchOptions, method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load users",
      status: res.status,
    };
  }
  return { ok: true, data: data as UsersByRoleResponse };
}

/** Payload for creating a user. Default password is set on server (Alabama2025!). */
export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  companyId: number;
  role: string;
};

/** Call this to create a user (admin/IT only). */
export async function CREATE_USER_API(
  payload: CreateUserPayload
): Promise<
  | { ok: true; id: string; userName: string }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(API.users, {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to create user",
      status: res.status,
    };
  }
  const id = (data as { id?: string }).id;
  const userName = (data as { userName?: string }).userName;
  if (typeof id !== "string" || typeof userName !== "string") {
    return {
      ok: false,
      error: (data?.error as string) ?? "Invalid response from server",
      status: res.status,
    };
  }
  return { ok: true, id, userName };
}

/** Call this to reset a user's password to Alabama2025! (admin/IT only). */
export async function RESET_USER_PASSWORD_API(userId: string): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.users}/${encodeURIComponent(userId)}/reset-password`, {
    ...defaultFetchOptions,
    method: "POST",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to reset password",
      status: res.status,
    };
  }
  return { ok: true };
}

/** Call this to delete a user (IT only). Removes intern/timelogs if present, then roles, logins, user. */
export async function DELETE_USER_API(userId: string): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.users}/${encodeURIComponent(userId)}`, {
    ...defaultFetchOptions,
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to delete user",
      status: res.status,
    };
  }
  return { ok: true };
}

/** User roles for Assign Roles page (all 8 roles; intern is display-only). */
export type UserRolesResponse = {
  firstName: string;
  lastName: string;
  roles: Record<string, boolean>;
};

/** Call this to get a user's name and current roles (IT only). */
export async function GET_USER_ROLES_API(userId: string): Promise<
  | { ok: true; data: UserRolesResponse }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.users}/${encodeURIComponent(userId)}/roles`, {
    ...defaultFetchOptions,
    method: "GET",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to load user roles",
      status: res.status,
    };
  }
  return { ok: true, data: data as UserRolesResponse };
}

/** Payload for updating roles (editable roles only; intern is not sent). */
export type UpdateUserRolesPayload = {
  accountant?: boolean;
  admin?: boolean;
  advisor?: boolean;
  client?: boolean;
  IT?: boolean;
  reception?: boolean;
  staff?: boolean;
};

/** Call this to update a user's roles (IT only). Intern is not updated. */
export async function UPDATE_USER_ROLES_API(
  userId: string,
  payload: UpdateUserRolesPayload
): Promise<
  | { ok: true }
  | { ok: false; error: string; status?: number }
> {
  const res = await fetch(`${API.users}/${encodeURIComponent(userId)}/roles`, {
    ...defaultFetchOptions,
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: (data?.error as string) ?? "Failed to update roles",
      status: res.status,
    };
  }
  return { ok: true };
}
