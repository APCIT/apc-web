'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GET_COMPANIES_API,
  CREATE_USER_API,
  type CompanyItem,
} from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

const CREATE_ROLES = [
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
  { value: "advisor", label: "Advisor" },
  { value: "client", label: "Client" },
  { value: "IT", label: "IT" },
  { value: "reception", label: "Reception" },
  { value: "staff", label: "Staff" },
];

export default function CreateNewUserPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState<number | "">("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await GET_COMPANIES_API();
      if (cancelled) return;
      setLoadingCompanies(false);
      if (res.ok) {
        setCompanies(res.companies);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (companyId === "" || !role) {
      setError("Please select a company and a role.");
      return;
    }
    setSubmitting(true);
    const res = await CREATE_USER_API({
      firstName,
      lastName,
      email,
      companyId: companyId as number,
      role,
    });
    setSubmitting(false);
    if (res.ok) {
      router.push("/Manage/Users");
      return;
    }
    setError(res.error);
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
            Create New User
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="first-name" className={labelClass}>
              First Name
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="First name"
                required
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="last-name" className={labelClass}>
              Last Name
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Email"
                required
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="company" className={labelClass}>
              Company
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <select
                id="company"
                value={companyId}
                onChange={(e) =>
                  setCompanyId(e.target.value === "" ? "" : Number(e.target.value))
                }
                className={inputClass}
                required
                disabled={loadingCompanies}
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.abbreviation || `Company ${c.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="role" className={labelClass}>
              Role
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select role</option>
                {CREATE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button
                type="submit"
                disabled={submitting || loadingCompanies}
                className={actionButtonClass}
              >
                {submitting ? "Creating…" : "Create"}
              </button>
              <Link
                href="/Manage/Users"
                className={actionButtonClass + " no-underline"}
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            href="/Manage/Users"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span
              className="text-[14px] font-bold"
              style={{ marginRight: "10px" }}
            >
              &#10094;
            </span>
            Back to Users
          </Link>
        </div>
      </div>
    </div>
  );
}
