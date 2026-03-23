"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  GET_TODO_LIST_API,
  GET_INTERN_DETAIL_API,
  PATCH_INTERN_EDIT_INFO_API,
  UPDATE_INTERN_RESUME_API,
  type InternDetailItem,
} from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const selectClass =
  "min-w-[140px] px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px] bg-white";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold pr-5";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";
const helperClass = "text-[12px] font-roboto text-[#666] mt-1";

const skeletonStyle = {
  height: "40px",
  width: "200px",
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

/** School: value = code (saved to DB), label = full name. */
const SCHOOL_OPTIONS: { value: string; label: string }[] = [
  { value: "UA", label: "UA - The University of Alabama" },
  { value: "UAB", label: "UAB - The University of Alabama at Birmingham" },
  { value: "UAH", label: "UAH - University of Alabama at Huntsville" },
  { value: "USA", label: "USA - University of South Alabama" },
  { value: "SSCC", label: "SSCC - Shelton State Community College" },
  { value: "MS", label: "MS - Mississippi State" },
  { value: "UM", label: "UM - University of Mississippi" },
  { value: "SC", label: "SC - Stillman College" },
  { value: "CCC", label: "CCC - Calhoun Community College" },
  { value: "DCC", label: "DCC - Drake Community College" },
  { value: "AAM", label: "AAM - Alabama A&M" },
  { value: "OM", label: "OM - Ole Miss" },
  { value: "ASU", label: "ASU - Athens" },
  { value: "PU", label: "PU - Purdue" },
  { value: "Other", label: "Other" },
];

/** Major: value = code (saved to DB), label = full name. Legacy MajorList structure: first option CS, then grouped. */
const MAJOR_FIRST_OPTION = { value: "CS", label: "CS" };
const MAJOR_GROUPS: { group: string; majors: { value: string; label: string }[] }[] = [
  {
    group: "ARTS & SCIENCES",
    majors: [
      { value: "BY", label: "Biology" },
      { value: "CH", label: "Chemistry" },
      { value: "ES", label: "Environmental Science" },
      { value: "MS", label: "Marine Science" },
      { value: "MA", label: "Mathematics" },
      { value: "MBY", label: "Microbiology" },
      { value: "PH", label: "Physics" },
      { value: "PY", label: "Psychology" },
      { value: "PSC", label: "Political Science" },
      { value: "PUH", label: "Public Health" },
    ],
  },
  {
    group: "BUSINESS",
    majors: [
      { value: "AC", label: "Accounting" },
      { value: "GB", label: "Business, general" },
      { value: "EC", label: "Economics" },
      { value: "FI", label: "Finance" },
      { value: "MGT", label: "Management" },
      { value: "MIS", label: "Management Information Systems" },
      { value: "MKT", label: "Marketing" },
      { value: "OM", label: "Operations Management" },
    ],
  },
  {
    group: "COMMUNICATIONS",
    majors: [
      { value: "ADV", label: "Advertising" },
      { value: "COM", label: "Communication Studies" },
      { value: "JN", label: "Journalism" },
      { value: "PURL", label: "Public Relations" },
      { value: "TCF", label: "Telecommunication and Film" },
    ],
  },
  {
    group: "ENGINEERING",
    majors: [
      { value: "AEM", label: "Aerospace Engineering" },
      { value: "CHE", label: "Chemical Engineering" },
      { value: "CE", label: "Civil Engineering" },
      { value: "CS", label: "Computer Science" },
      { value: "ECE", label: "Electrical Engineering" },
      { value: "ISE", label: "Industrial and Systems Engineering" },
      { value: "ME", label: "Mechanical Engineering" },
      { value: "MTE", label: "Metallurgical Engineering" },
    ],
  },
  {
    group: "HUMAN ENVIRONMENTAL",
    majors: [
      { value: "CSM", label: "Consumer Sciences" },
      { value: "HES", label: "Human Environmental Sciences" },
      { value: "RHM", label: "Restaurant and Hospitality Management" },
    ],
  },
  {
    group: "EDUCATION",
    majors: [
      { value: "KIN", label: "Kinesiology" },
      { value: "EXSC", label: "Exercise Science" },
    ],
  },
];

/** Level: value = UG | Master's | PhD (saved to DB), label = display. */
const LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: "UG", label: "Undergraduate" },
  { value: "Master's", label: "Master's" },
  { value: "PhD", label: "PhD" },
];

const DOB_MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const GRAD_MONTH_OPTIONS = [
  { value: 5, label: "May" },
  { value: 8, label: "August" },
  { value: 12, label: "December" },
];

/** State dropdown: two-letter abbreviation (value and display), matching DB storage. */
const US_STATE_ABBREVS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY",
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Parse ISO date string to { month, day, year } (1-12, 1-31, full year). Use UTC to avoid timezone shifting the calendar date. */
function parseDob(iso: string | null): { month: number; day: number; year: number } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate(), year: d.getUTCFullYear() };
}

/** Parse ISO date to grad month (5|8|12) and year. Use UTC to avoid timezone shifting the date. */
function parseGradDate(iso: string | null): { month: number; year: number } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const m = d.getUTCMonth() + 1;
  const gradMonth = [5, 8, 12].includes(m) ? m : 5;
  return { month: gradMonth, year: d.getUTCFullYear() };
}

const currentYear = new Date().getFullYear();
const GRAD_YEAR_OPTIONS = [0, 1, 2, 3, 4].map((i) => currentYear + i);

export default function EditInfoPage() {
  const [intern, setIntern] = useState<InternDetailItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");
  const [level, setLevel] = useState("");
  const [gradMonth, setGradMonth] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const todoRes = await GET_TODO_LIST_API();
    if (!todoRes.ok || !todoRes.data.internId) {
      setLoadError(todoRes.ok ? "You do not have an intern record." : (todoRes.error ?? "Failed to load."));
      setLoading(false);
      return;
    }
    const detailRes = await GET_INTERN_DETAIL_API(todoRes.data.internId);
    if (!detailRes.ok) {
      setLoadError(detailRes.error ?? "Failed to load your information.");
      setLoading(false);
      return;
    }
    const i = detailRes.data.intern;
    setIntern(i);
    setFirstName(i.firstName ?? "");
    setLastName(i.lastName ?? "");
    const dob = parseDob(i.dob ?? null);
    if (dob) {
      setDobMonth(String(dob.month));
      setDobDay(String(dob.day));
    } else {
      setDobMonth("");
      setDobDay("");
    }
    setEmail(i.email ?? "");
    setPhone(i.phone ?? "");
    setStreet(i.street ?? "");
    setApt(i.apt ?? "");
    setCity(i.city ?? "");
    setState(i.state ?? "");
    setZip(i.zip ?? "");
    setContactName(i.contactName ?? "");
    setContactPhone(i.contactPhone ?? "");
    setContactRelationship(i.contactRelationship ?? "");
    setSchool(i.school ?? "");
    setMajor(i.major ?? "");
    setMinor(i.minor ?? "");
    setLevel(
      (i.level ?? "") === "Undergraduate" ? "UG" : (i.level ?? "")
    );
    const grad = parseGradDate(i.gradDateIso ?? null);
    if (grad) {
      setGradMonth(String(grad.month));
      setGradYear(String(grad.year));
    } else {
      setGradMonth("");
      setGradYear(String(currentYear));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!intern) return;
    setError(null);
    setSubmitting(true);
    try {
      const editRes = await PATCH_INTERN_EDIT_INFO_API(intern.id, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        dobMonth: dobMonth ? parseInt(dobMonth, 10) : undefined,
        dobDay: dobDay ? parseInt(dobDay, 10) : undefined,
        street: street || undefined,
        apt: apt || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        contactName: contactName || undefined,
        contactRelationship: contactRelationship || undefined,
        contactPhone: contactPhone || undefined,
        school: school || undefined,
        major: major || undefined,
        minor: minor || undefined,
        level: level || undefined,
        gradMonth: gradMonth ? parseInt(gradMonth, 10) : undefined,
        gradYear: gradYear ? parseInt(gradYear, 10) : undefined,
      });
      if (!editRes.ok) {
        setError(editRes.error ?? "Failed to update information.");
        setSubmitting(false);
        return;
      }
      if (resumeFile) {
        const base64 = await fileToBase64(resumeFile);
        const resResume = await UPDATE_INTERN_RESUME_API(intern.id, {
          resumeFileBase64: base64,
          resumeFileName: resumeFile.name,
        });
        if (!resResume.ok) {
          setError(resResume.error ?? "Profile saved but resume upload failed.");
        } else {
          setResumeFile(null);
          if (resumeInputRef.current) resumeInputRef.current.value = "";
          await load();
          setError(null);
        }
      } else {
        setError(null);
      }
    } catch {
      setError("Failed to update information.");
    }
    setSubmitting(false);
  }

  if (loadError) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <div style={{ height: "20px" }} />
          <div className="text-center text-red-600 mb-6">{loadError}</div>
          <div>
            <Link href="/Manage" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-6">
          <Link href="/Manage" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
            Back to Account
          </Link>
        </div>

        <div className="mb-4 text-left">
          <h2 className="text-[24px] font-roboto" style={{ fontWeight: "normal", color: "#000000" }}>
            Edit Information
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-sm" style={{ color: "#900" }}>
              {error}
            </div>
          )}

          {/* 1. First Name */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 2. Last Name */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 3. Birthday */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Birthday</span>
            <div className="flex-1 flex items-center gap-2" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <>
                  <select value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className={selectClass} aria-label="Birth month">
                    <option value="">Month</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>{DOB_MONTH_NAMES[m]}</option>
                    ))}
                  </select>
                  <select value={dobDay} onChange={(e) => setDobDay(e.target.value)} className={selectClass} aria-label="Birth day">
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* 4. Email */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 5. Phone */}
          <div className="flex items-start" style={rowStyle}>
            <label htmlFor="phone" className={labelClass} style={{ paddingTop: "10px" }}>Phone</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <>
                  <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="(555) 555-5555" />
                  <p className={helperClass}>Ex: (555) 555-5555</p>
                </>
              )}
            </div>
          </div>

          {/* 6. Permanent Address */}
          <div className="flex items-start" style={rowStyle}>
            <span className={labelClass} style={{ paddingTop: "10px" }}>Permanent Address</span>
            <div className="flex-1 flex flex-col gap-2" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <>
                  <div className="flex gap-3 flex-wrap">
                    <input id="street" type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={inputClass} placeholder="Street" />
                    <input id="apt" type="text" value={apt} onChange={(e) => setApt(e.target.value)} className={inputClass} placeholder="Apt" />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="City" />
                    <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass} aria-label="State">
                      <option value="">State</option>
                      {US_STATE_ABBREVS.map((abbrev) => (
                        <option key={abbrev} value={abbrev}>{abbrev}</option>
                      ))}
                    </select>
                    <input id="zip" type="text" value={zip} onChange={(e) => setZip(e.target.value)} className={inputClass} placeholder="ZIP" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 7. Emergency Contact */}
          <div className="flex items-start" style={rowStyle}>
            <span className={labelClass} style={{ paddingTop: "10px" }}>Emergency Contact</span>
            <div className="flex-1 flex flex-col gap-2" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <>
                  <input id="contactName" type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} placeholder="Name" />
                  <div>
                    <input id="contactPhone" type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} placeholder="(555) 555-5555" />
                    <p className={helperClass}>Ex: (555) 555-5555</p>
                  </div>
                  <input id="contactRelationship" type="text" value={contactRelationship} onChange={(e) => setContactRelationship(e.target.value)} className={inputClass} placeholder="Relationship" />
                </>
              )}
            </div>
          </div>

          {/* 8. School */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="school" className={labelClass}>School</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <select id="school" value={school} onChange={(e) => setSchool(e.target.value)} className={selectClass}>
                  <option value="">Please select your school</option>
                  {SCHOOL_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 9. Major */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="major" className={labelClass}>Major</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <select id="major" value={major} onChange={(e) => setMajor(e.target.value)} className={selectClass}>
                  <option value="">Select major</option>
                  <option value={MAJOR_FIRST_OPTION.value}>{MAJOR_FIRST_OPTION.label}</option>
                  {MAJOR_GROUPS.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.majors.map((m) => (
                        <option key={`${g.group}-${m.value}`} value={m.value}>{m.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 10. Minor */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="minor" className={labelClass}>Minor</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="minor" type="text" value={minor} onChange={(e) => setMinor(e.target.value)} className={inputClass} placeholder="Optional" />
              )}
            </div>
          </div>

          {/* 11. Level */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="level" className={labelClass}>Level</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
                  <option value="">Select level</option>
                  {LEVEL_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 12. Graduation */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Graduation</span>
            <div className="flex-1 flex items-center gap-2" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <>
                  <select value={gradMonth} onChange={(e) => setGradMonth(e.target.value)} className={selectClass} aria-label="Graduation month">
                    <option value="">Month</option>
                    {GRAD_MONTH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className={selectClass} aria-label="Graduation year">
                    <option value="">Year</option>
                    {GRAD_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* 13. Resume */}
          <div className="flex items-start" style={rowStyle}>
            <span className={labelClass}>Resume</span>
            <div className="flex-1 flex flex-col gap-2" style={{ marginLeft: "20px" }}>
              {!loading && (
                <>
                  {intern?.resumeId?.trim() && intern.resumeId.length > 15 ? (
                    <p className="text-[14px] font-roboto text-[#333] m-0">
                      Current resume:{" "}
                      <a
                        href={`https://apcstorage.blob.core.windows.net/resumes/${encodeURIComponent(intern.resumeId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#337ab7] underline hover:no-underline"
                      >
                        View
                      </a>
                    </p>
                  ) : (
                    <p className="text-[14px] font-roboto text-[#666] m-0">No resume on file.</p>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-3 py-1 border border-[#767676] bg-white text-[#333] text-sm rounded hover:bg-gray-100"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      Choose File
                    </button>
                    <span className="text-[14px] font-roboto text-[#333]">
                      {resumeFile ? resumeFile.name : "No file chosen"}
                    </span>
                    <input
                      ref={resumeInputRef}
                      type="file"
                      name="resume"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <span className={helperClass}>Choose a file to upload or replace your resume. Leave empty to keep your current resume.</span>
                </>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center mt-6">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button type="submit" disabled={submitting || loading} className={actionButtonClass}>
                {submitting ? "Saving…" : "Save"}
              </button>
              <Link href="/Manage" className={actionButtonClass + " no-underline"}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
