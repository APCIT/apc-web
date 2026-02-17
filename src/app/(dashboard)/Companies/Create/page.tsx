'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CREATE_COMPANY_API } from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

export default function CompaniesCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await CREATE_COMPANY_API({ name, abbreviation });
    setSubmitting(false);
    if (res.ok) {
      router.push("/Companies");
      return;
    }
    setError(res.error);
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-4">
          <h2 className="text-[30px] font-roboto" style={{ fontWeight: "normal", color: "#000000" }}>
            Create Company
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
            <label htmlFor="company-name" className={labelClass}>
              Name
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="company-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="company-abbreviation" className={labelClass}>
              Abbreviation
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="company-abbreviation"
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className={inputClass}
                placeholder="Abbreviation"
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button
                type="submit"
                disabled={submitting}
                className={actionButtonClass}
              >
                {submitting ? "Saving…" : "Create"}
              </button>
              <Link href="/Companies" className={actionButtonClass + " no-underline"}>
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            href="/Companies"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
            Back to Companies
          </Link>
        </div>
      </div>
    </div>
  );
}
