"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { GET_APPLICANT_API, UPDATE_APPLICANT_API, type ApplicantEditItem } from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const textareaClass =
  "w-full max-w-[400px] min-h-[80px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666]";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
const displayClass = "text-[14px] font-roboto text-[#333]";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

const skeletonStyle = {
  height: "40px",
  width: "200px",
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
};

export default function ApplicantsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [applicant, setApplicant] = useState<ApplicantEditItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");
  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const [interviewStatus, setInterviewStatus] = useState(false);
  const [callBack, setCallBack] = useState(false);
  const [validEmp, setValidEmp] = useState(false);
  const [prevIntern, setPrevIntern] = useState(false);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoadError("Invalid applicant id");
      setLoading(false);
      return;
    }
    const load = async () => {
      const res = await GET_APPLICANT_API(id);
      setLoading(false);
      if (res.ok) {
        const a = res.applicant;
        setApplicant(a);
        setFirstName(a.firstName);
        setLastName(a.lastName);
        setEmail(a.email);
        setSchool(a.school);
        setMajor(a.major);
        setMinor(a.minor);
        setComment(a.comment);
        setNote(a.note);
        setInterviewStatus(a.interviewStatus);
        setCallBack(a.callBack);
        setValidEmp(a.validEmp);
        setPrevIntern(a.prevIntern);
      } else {
        setLoadError(res.error ?? "Failed to load applicant");
      }
    };
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await UPDATE_APPLICANT_API(id, {
      firstName,
      lastName,
      email,
      school,
      major,
      minor,
      comment,
      note,
      interviewStatus,
      callBack,
      validEmp,
      prevIntern,
    });
    setSubmitting(false);
    if (res.ok) {
      router.push(`/Applicants/Details/${id}`);
      return;
    }
    setError(res.error ?? "Failed to update");
  }

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
        <div style={{ height: "20px" }} />

        <div className="mb-4 text-center">
          <h2 className="text-[24px] font-roboto inline" style={{ fontWeight: "normal", color: "#900" }}>
            Edit Applicant{" "}
            {loading ? (
              <span className="inline-block align-middle ml-1" style={{ ...skeletonStyle, width: "160px", height: "24px" }} aria-hidden />
            ) : (
              [firstName, lastName].filter(Boolean).length ? ` - ${[firstName, lastName].filter(Boolean).join(" ")}` : ""
            )}
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 1. First Name (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 2. Last Name (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 3. Date Applied (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Date Applied</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.dateApplied ?? "—"}</span>
            </div>
          </div>

          {/* 4. Email (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 5. Phone (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Phone</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.phone || "—"}</span>
            </div>
          </div>

          {/* 6. Permanent Address (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Permanent Address</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>
                {applicant ? [applicant.street, applicant.apt, applicant.city, applicant.state, applicant.zip].filter(Boolean).join(", ") || "—" : "—"}
              </span>
            </div>
          </div>

          {/* 7. School (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="school" className={labelClass}>School</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="school" type="text" value={school} onChange={(e) => setSchool(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 8. Major (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="major" className={labelClass}>Major</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="major" type="text" value={major} onChange={(e) => setMajor(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 9. Minor (editable) */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="minor" className={labelClass}>Minor</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={skeletonStyle} aria-hidden /> : (
                <input id="minor" type="text" value={minor} onChange={(e) => setMinor(e.target.value)} className={inputClass} />
              )}
            </div>
          </div>

          {/* 10. Foreign Language (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Foreign Language</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.foreignLanguage || "—"}</span>
            </div>
          </div>

          {/* 11–15. Location checkmarks (read-only, unclickable) */}
          {(["Birmingham", "Huntsville", "Mobile", "Montgomery", "Tuscaloosa"] as const).map((label, i) => {
            const key = (["birmingham", "huntsville", "mobile", "montgomery", "tuscaloosa"] as const)[i];
            const checked = applicant?.[key];
            return (
              <div key={key} className="flex items-center" style={rowStyle}>
                <span className={labelClass}>{label}</span>
                <div className="flex-1" style={{ marginLeft: "20px" }}>
                  <span className={displayClass}>{checked ? "✓" : ""}</span>
                </div>
              </div>
            );
          })}

          {/* 16. Available Semester(s) (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Available Semester(s)</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.semester || "—"}</span>
            </div>
          </div>

          {/* 17. Level (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Level</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.level || "—"}</span>
            </div>
          </div>

          {/* 18. Graduation Date (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Graduation Date</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>{applicant?.gradDate ?? "—"}</span>
            </div>
          </div>

          {/* 19. Emergency Contact (read-only text) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Emergency Contact</span>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <span className={displayClass}>
                {applicant ? [applicant.contactName, applicant.contactRelationship, applicant.contactPhone].filter(Boolean).join(" -- ") || "—" : "—"}
              </span>
            </div>
          </div>

          {/* 20. Interviewed (editable checkbox) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Interviewed</span>
            <div className="flex-1 flex items-center" style={{ marginLeft: "20px" }}>
              {!loading && (
                <input type="checkbox" id="interviewed" checked={interviewStatus} onChange={(e) => setInterviewStatus(e.target.checked)} className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* 21. Call Back (editable checkbox) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Call Back</span>
            <div className="flex-1 flex items-center" style={{ marginLeft: "20px" }}>
              {!loading && (
                <input type="checkbox" id="callBack" checked={callBack} onChange={(e) => setCallBack(e.target.checked)} className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* 22. Previous Intern (editable checkbox) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Previous Intern</span>
            <div className="flex-1 flex items-center" style={{ marginLeft: "20px" }}>
              {!loading && (
                <input type="checkbox" id="prevIntern" checked={prevIntern} onChange={(e) => setPrevIntern(e.target.checked)} className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* Valid US Employee (editable checkbox) */}
          <div className="flex items-center" style={rowStyle}>
            <span className={labelClass}>Valid US Employee</span>
            <div className="flex-1 flex items-center" style={{ marginLeft: "20px" }}>
              {!loading && (
                <input type="checkbox" id="validEmp" checked={validEmp} onChange={(e) => setValidEmp(e.target.checked)} className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* 23. Interview Comment (editable textarea) */}
          <div className="flex items-start" style={rowStyle}>
            <label htmlFor="comment" className={labelClass} style={{ paddingTop: "8px" }}>Interview Comment</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={{ ...skeletonStyle, minHeight: "80px" }} aria-hidden /> : (
                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className={textareaClass} />
              )}
            </div>
          </div>

          {/* 24. Note (editable textarea) */}
          <div className="flex items-start" style={rowStyle}>
            <label htmlFor="note" className={labelClass} style={{ paddingTop: "8px" }}>Note</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? <div style={{ ...skeletonStyle, minHeight: "80px" }} aria-hidden /> : (
                <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className={textareaClass} />
              )}
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button type="submit" disabled={submitting || loading} className={actionButtonClass}>
                {submitting ? "Saving…" : "Save"}
              </button>
              <Link href="/Applicants" className={actionButtonClass + " no-underline"}>
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link href="/Applicants" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
            Back to Applicants
          </Link>
        </div>
      </div>
    </div>
  );
}
