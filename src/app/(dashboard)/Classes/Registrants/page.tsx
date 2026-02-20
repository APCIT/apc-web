"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GET_CLASS_REGISTRANTS_API, type ClassRegItem } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "", label: "Recent" },
  { value: "Class", label: "Class" },
  { value: "LastName", label: "LastName" },
  { value: "Company", label: "Company" },
] as const;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "\u2014" : d.toLocaleDateString();
  } catch {
    return "\u2014";
  }
}

export default function ClassRegistrantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") ?? "";

  const [registrants, setRegistrants] = useState<ClassRegItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveSort = useMemo(() => {
    if (sortBy === "Class" || sortBy === "Company" || sortBy === "LastName") return sortBy;
    return "";
  }, [sortBy]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GET_CLASS_REGISTRANTS_API(effectiveSort || undefined)
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setRegistrants(res.registrants);
        else setError(res.error);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load class registrants");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveSort]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const url = value ? `/Classes/Registrants?sortBy=${encodeURIComponent(value)}` : "/Classes/Registrants";
      router.push(url);
    },
    [router]
  );

  const thClass = "border border-[#7a0000] p-[10px] text-white font-normal text-center";
  const thBold = "font-bold";
  const tdClass = "border border-[#ddd] p-[10px] text-center align-middle text-[#666]";

  const dateStyle = effectiveSort === "" ? thBold : "";
  const classStyle = effectiveSort === "Class" ? thBold : "";
  const companyStyle = effectiveSort === "Company" ? thBold : "";
  const lastNameStyle = effectiveSort === "LastName" ? thBold : "";

  return (
    <div className="w-full min-w-0 bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: "normal", color: "#900" }}
          >
            Class Registrants
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <label htmlFor="sortBy" className="sr-only">
            Sort by
          </label>
          <select
            id="sortBy"
            value={effectiveSort}
            onChange={handleSortChange}
            className="pl-[12px] pr-[32px] py-[8px] border border-[#333] rounded-[6px] text-[#333] bg-white text-[14px] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{
              minWidth: "160px",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 12px center",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value || "recent"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="w-full min-w-0 overflow-x-auto"
          style={{ marginTop: "20px", marginBottom: "48px" }}
        >
          {error && (
            <p className="font-roboto text-red-600 mb-4">{error}</p>
          )}
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className={`${thClass} ${dateStyle}`}>Date Registered</th>
                <th className={`${thClass} ${classStyle}`}>Class</th>
                <th className={`${thClass} ${lastNameStyle}`}>Name</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Phone</th>
                <th className={`${thClass} ${companyStyle}`}>Company</th>
                <th className={thClass}>Job Title</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={tdClass}>
                    Loading…
                  </td>
                </tr>
              ) : registrants.length === 0 ? (
                <tr>
                  <td colSpan={7} className={tdClass}>
                    No registrants.
                  </td>
                </tr>
              ) : (
                registrants.map((r) => (
                  <tr key={r.id} className="bg-white hover:bg-[#f5f5f5]">
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{formatDate(r.dateApplied)}</td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{r.class || "\u2014"}</td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>
                      {[r.lastName, r.firstName].filter(Boolean).join(", ") || "\u2014"}
                    </td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{r.email || "\u2014"}</td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{r.phone || "\u2014"}</td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{r.company || "\u2014"}</td>
                    <td className={`${tdClass} align-top break-words whitespace-normal min-w-0`}>{r.jobTitle || "\u2014"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
