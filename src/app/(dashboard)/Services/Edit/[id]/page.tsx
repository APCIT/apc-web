'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GET_SERVICE_BY_ID_API,
  GET_COMPANIES_API,
  UPDATE_SERVICE_API,
  type ServiceDetailItem,
  type CompanyItem,
  type UpdateServicePayload,
} from "@/lib/api";

const ALABAMA_COUNTIES = [
  "Autauga", "Baldwin", "Barbour", "Bibb", "Blount", "Bullock", "Butler", "Calhoun", "Chambers",
  "Cherokee", "Chilton", "Choctaw", "Clarke", "Clay", "Cleburne", "Coffee", "Colbert", "Conecuh",
  "Coosa", "Covington", "Crenshaw", "Cullman", "Dale", "Dallas", "DeKalb", "Elmore", "Escambia",
  "Etowah", "Fayette", "Franklin", "Geneva", "Greene", "Hale", "Henry", "Houston", "Jackson",
  "Jefferson", "Lamar", "Lauderdale", "Lawrence", "Lee", "Limestone", "Lowndes", "Macon", "Madison",
  "Marengo", "Marion", "Marshall", "Mobile", "Monroe", "Montgomery", "Morgan", "Perry", "Pickens",
  "Pike", "Randolph", "Russell", "St. Clair", "Shelby", "Sumter", "Talladega", "Tallapoosa",
  "Tuscaloosa", "Walker", "Washington", "Wilcox", "Winston",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getYearOptions(): number[] {
  const y = new Date().getFullYear();
  const out: number[] = [];
  for (let i = y - 5; i <= y + 2; i++) out.push(i);
  return out.reverse();
}

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
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

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "";
  const id = parseInt(idParam, 10);

  const [service, setService] = useState<ServiceDetailItem | null>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [typeOfService, setTypeOfService] = useState("");
  const [staffMember, setStaffMember] = useState("");
  const [fieldStaff, setFieldStaff] = useState(0);
  const [county, setCounty] = useState("");
  const [numberEmployeesTrained, setNumberEmployeesTrained] = useState(0);
  const [numberInterns, setNumberInterns] = useState(0);
  const [companyId, setCompanyId] = useState<number | "">("");
  const [completed, setCompleted] = useState(false);
  const [certificate, setCertificate] = useState(false);
  const [startDateMonth, setStartDateMonth] = useState(1);
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [endDateMonth, setEndDateMonth] = useState(1);
  const [semesterYearEnd, setSemesterYearEnd] = useState(new Date().getFullYear());

  const yearOptions = getYearOptions();

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setLoading(false);
      setError("Invalid service id");
      return;
    }
    let cancelled = false;
    Promise.all([GET_SERVICE_BY_ID_API(id), GET_COMPANIES_API()])
      .then(([serviceRes, companiesRes]) => {
        if (cancelled) return;
        if (serviceRes.ok) {
          const s = serviceRes.service;
          setService(s);
          setTypeOfService(s.typeOfService);
          setStaffMember(s.staffMember);
          setFieldStaff(s.fieldStaff);
          setCounty(s.county);
          setNumberEmployeesTrained(s.numberEmployeesTrained);
          setNumberInterns(s.numberInterns);
          setCompanyId(s.companyId ?? "");
          setCompleted(s.completed);
          setCertificate(s.certificate);
          const startD = new Date(s.startDate);
          setStartDateMonth(startD.getUTCMonth() + 1);
          setSemesterYear(startD.getUTCFullYear());
          const endD = new Date(s.endDate);
          setEndDateMonth(endD.getUTCMonth() + 1);
          setSemesterYearEnd(endD.getUTCFullYear());
        } else {
          setError(serviceRes.status === 404 ? "Service not found" : serviceRes.error);
        }
        if (companiesRes.ok) setCompanies(companiesRes.companies);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load service");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isInteger(id) || id <= 0 || !service) return;
    setSubmitError(null);
    setSaving(true);
    const cId = companyId === "" ? 0 : companyId;
    const payload: UpdateServicePayload = {
      typeOfService,
      staffMember,
      fieldStaff,
      county,
      numberEmployeesTrained,
      numberInterns,
      companyId: cId,
      completed,
      certificate,
      startDateMonth,
      semesterYear,
      endDateMonth,
      semesterYearEnd,
    };
    const res = await UPDATE_SERVICE_API(id, payload);
    setSaving(false);
    if (res.ok) {
      router.push(`/Services/Details/${id}`);
      return;
    }
    setSubmitError(res.error);
  };

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">Invalid service.</p>
          <Link href="/Services" className={backButtonClass + " mt-4 inline-block"}>
            Back To Index
          </Link>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <div style={{ height: "20px" }} />
          <div className="text-center text-red-600 mb-6">{error}</div>
          <div>
            <Link href="/Services" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back To Index
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCompanyFirst = companyId !== "" ? companies.find((c) => c.id === companyId) : null;
  const otherCompanies = companies.filter((c) => c.id !== companyId);
  const companyList = currentCompanyFirst ? [currentCompanyFirst, ...otherCompanies] : companies;
  const countyList = county ? [county, ...ALABAMA_COUNTIES.filter((c) => c !== county)] : ALABAMA_COUNTIES;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-4">
          <h2 className="text-[30px] font-roboto" style={{ fontWeight: "normal", color: "#000000" }}>
            Edit Service Record
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <input type="hidden" name="id" value={id} />
          {submitError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="type-of-service" className={labelClass}>Type of Service</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="type-of-service"
                  type="text"
                  value={typeOfService}
                  onChange={(e) => setTypeOfService(e.target.value)}
                  className={inputClass}
                  required
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="staff-member" className={labelClass}>Staff Member</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="staff-member"
                  type="text"
                  value={staffMember}
                  onChange={(e) => setStaffMember(e.target.value)}
                  className={inputClass}
                  required
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="field-staff" className={labelClass}>Field Staff</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="field-staff"
                  type="number"
                  min={0}
                  value={fieldStaff}
                  onChange={(e) => setFieldStaff(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="company" className={labelClass}>Company</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <select
                  id="company"
                  className={inputClass}
                  value={companyId === "" ? "" : String(companyId)}
                  onChange={(e) => setCompanyId(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                >
                  <option value="">Select company</option>
                  {companyList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="county" className={labelClass}>County</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <select
                  id="county"
                  className={inputClass}
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  required
                >
                  <option value="">Select county</option>
                  {countyList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="employees-trained" className={labelClass}>Number of Employees Trained</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="employees-trained"
                  type="number"
                  min={0}
                  value={numberEmployeesTrained}
                  onChange={(e) => setNumberEmployeesTrained(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>Certificate</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <label className="flex items-center gap-2 font-roboto text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certificate}
                    onChange={(e) => setCertificate(e.target.checked)}
                  />
                  Certificate Awarded
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="number-interns" className={labelClass}>Number of Interns</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="number-interns"
                  type="number"
                  min={0}
                  value={numberInterns}
                  onChange={(e) => setNumberInterns(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>Start Date</label>
            <div className="flex-1 flex gap-2" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <>
                  <select
                    className={inputClass}
                    style={{ width: "140px" }}
                    value={startDateMonth}
                    onChange={(e) => setStartDateMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    className={inputClass}
                    style={{ width: "100px" }}
                    value={semesterYear}
                    onChange={(e) => setSemesterYear(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>End Date</label>
            <div className="flex-1 flex gap-2" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <>
                  <select
                    className={inputClass}
                    style={{ width: "140px" }}
                    value={endDateMonth}
                    onChange={(e) => setEndDateMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    className={inputClass}
                    style={{ width: "100px" }}
                    value={semesterYearEnd}
                    onChange={(e) => setSemesterYearEnd(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>Completed</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <label className="flex items-center gap-2 font-roboto text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                  />
                  Completed
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button
              type="submit"
              disabled={saving || loading}
              className={actionButtonClass}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <Link href={`/Services/Details/${id}`} className={actionButtonClass + " no-underline"}>
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            href="/Services"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
            Back To Index
          </Link>
        </div>
      </div>
    </div>
  );
}
