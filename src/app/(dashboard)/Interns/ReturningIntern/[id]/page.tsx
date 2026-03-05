"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  GET_INTERN_DETAIL_API,
  GET_COMPANIES_API,
  POST_INTERN_NEW_SEMESTER_API,
  type CompanyItem,
} from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const selectClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px] bg-white";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
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

const SEASON_OPTIONS = [
  { value: "", label: "Semester" },
  { value: "April", label: "Spring" },
  { value: "July", label: "Summer" },
  { value: "November", label: "Fall" },
] as const;

export default function ReturningInternPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [internName, setInternName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [season, setSeason] = useState("");
  const [year, setYear] = useState("");
  const [wage, setWage] = useState("");
  const [companyId, setCompanyId] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "", label: "Year" },
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear + 1), label: String(currentYear + 1) },
  ];

  useEffect(() => {
    if (!id) {
      setLoadError("Invalid intern id");
      setLoading(false);
      return;
    }
    Promise.all([GET_INTERN_DETAIL_API(id), GET_COMPANIES_API()])
      .then(([internRes, companiesRes]) => {
        if (internRes.ok) {
          const i = internRes.data.intern;
          setInternName(`${i.firstName} ${i.lastName}`.trim());
          setWage(i.wage != null ? String(i.wage) : "");
          setCompanyId(i.companyId ?? 0);
        } else {
          setLoadError(internRes.error);
        }
        if (companiesRes.ok) {
          setCompanies(companiesRes.companies);
        }
      })
      .catch(() => setLoadError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!season) {
      setError("Please select a semester season.");
      return;
    }
    if (!year) {
      setError("Please select a year.");
      return;
    }
    const parsedWage = parseFloat(wage);
    if (Number.isNaN(parsedWage) || parsedWage < 7.25) {
      setError("Wage must be at least $7.25.");
      return;
    }
    if (companyId <= 0) {
      setError("Please select a company.");
      return;
    }

    setSubmitting(true);
    const res = await POST_INTERN_NEW_SEMESTER_API(id, {
      semesterSeason: season as "April" | "July" | "November",
      semesterYear: Number(year),
      wage: parsedWage,
      companyId,
    });
    setSubmitting(false);

    if (res.ok) {
      router.push("/Interns");
      return;
    }
    setError(res.error);
  }

  if (loadError) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <div style={{ height: "20px" }} />
          <div className="text-center text-red-600 mb-6">{loadError}</div>
          <div>
            <Link
              href="/Interns"
              className={backButtonClass}
              style={{ fontWeight: "normal", textDecoration: "none" }}
            >
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>
                &#10094;
              </span>
              Back to Interns
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

        <div className="mb-4">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            {loading ? "Returning Intern" : `Returning Intern - ${internName}`}
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Semester season */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="semester-season" className={labelClass}>
              Semester
            </label>
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <>
                  <select
                    id="semester-season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className={selectClass}
                    aria-label="Semester season"
                  >
                    {SEASON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <select
                    id="semester-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={selectClass}
                    aria-label="Semester year"
                  >
                    {yearOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Wage */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="wage" className={labelClass}>
              Wage
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="wage"
                  type="text"
                  inputMode="decimal"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className={inputClass}
                  placeholder="Wage"
                />
              )}
            </div>
          </div>

          {/* Company */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="companyId" className={labelClass}>
              Company
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <select
                  id="companyId"
                  value={companyId || ""}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                  className={selectClass}
                  aria-label="Company"
                >
                  <option value="">Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button
                type="submit"
                disabled={submitting || loading}
                className={actionButtonClass}
              >
                {submitting ? "Saving…" : "Save"}
              </button>
              <Link
                href={`/Interns/Details/${encodeURIComponent(id)}`}
                className={actionButtonClass + " no-underline"}
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            href="/Interns"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>
              &#10094;
            </span>
            Back to Interns
          </Link>
        </div>
      </div>
    </div>
  );
}
