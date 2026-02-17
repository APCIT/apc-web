'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { GET_COMPANY_API, UPDATE_COMPANY_API } from "@/lib/api";

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

export default function CompaniesEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoadError("Invalid company id");
      setLoading(false);
      return;
    }
    const load = async () => {
      const res = await GET_COMPANY_API(id);
      setLoading(false);
      if (res.ok) {
        setName(res.company.name);
        setAbbreviation(res.company.abbreviation);
      } else {
        setLoadError(res.error);
      }
    };
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await UPDATE_COMPANY_API(id, { name, abbreviation });
    setSubmitting(false);
    if (res.ok) {
      router.push("/Companies");
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
            <Link href="/Companies" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back to Companies
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
          <h2 className="text-[30px] font-roboto" style={{ fontWeight: "normal", color: "#000000" }}>
            Edit Company
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
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="company-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Company name"
                />
              )}
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="company-abbreviation" className={labelClass}>
              Abbreviation
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              {loading ? (
                <div style={skeletonStyle} aria-hidden />
              ) : (
                <input
                  id="company-abbreviation"
                  type="text"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  className={inputClass}
                  placeholder="Abbreviation"
                />
              )}
            </div>
          </div>

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
