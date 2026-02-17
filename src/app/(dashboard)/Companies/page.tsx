'use client';

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GET_COMPANIES_API, DELETE_COMPANY_API, type CompanyItem } from "@/lib/api";

const DELETE_CONFIRM_MESSAGE = "Are you sure you want to permanently delete this Company?";

export default function CompaniesPage() {
  const [data, setData] = useState<
    | { ok: true; companies: CompanyItem[] }
    | { ok: false; error: string; status?: number }
    | null
  >(null);

  const load = useCallback(async () => {
    const res = await GET_COMPANIES_API();
    setData(res);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(c: CompanyItem) {
    if (!window.confirm(DELETE_CONFIRM_MESSAGE)) return;
    const res = await DELETE_COMPANY_API(c.id);
    if (res.ok) {
      load();
    } else {
      alert(res.error);
    }
  }

  if (data?.ok === false) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px] text-center text-red-600">
          {data.status === 403
            ? "You don't have permission to view companies."
            : data.error}
        </div>
      </div>
    );
  }

  const companies = data?.ok ? data.companies : [];
  const loading = data === null;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Companies
          </h2>
        </div>

        <div className="mb-4">
          <Link
            href="/Companies/Create"
            className="presentation-upload-btn inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] bg-white text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline text-inherit hover:bg-gray-50"
          >
            Create New
          </Link>
        </div>

        <div
          className="overflow-x-auto"
          style={{ marginTop: "20px", marginBottom: "48px" }}
        >
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th
                  className="border border-[#7a0000] p-[10px] text-white font-normal text-center"
                  style={{ width: "55%" }}
                >
                  Name
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Abbreviation
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="bg-white">
                  <td className="border border-[#ddd] p-[10px] text-left align-middle">
                    <div
                      aria-hidden
                      style={{
                        height: "16px",
                        width: "180px",
                        backgroundColor: "rgb(209 213 219)",
                        borderRadius: "4px",
                        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      }}
                    />
                  </td>
                  <td className="border border-[#ddd] p-[10px] text-left align-middle">
                    <div
                      aria-hidden
                      style={{
                        height: "16px",
                        width: "60px",
                        backgroundColor: "rgb(209 213 219)",
                        borderRadius: "4px",
                        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      }}
                    />
                  </td>
                  <td className="border border-[#ddd] p-[10px] text-center align-middle">
                    <div
                      aria-hidden
                      style={{
                        height: "16px",
                        width: "80px",
                        backgroundColor: "rgb(209 213 219)",
                        borderRadius: "4px",
                        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        display: "inline-block",
                      }}
                    />
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">
                    —
                  </td>
                  <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">
                    —
                  </td>
                  <td className="border border-[#ddd] p-[10px] text-center align-middle">
                    —
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id} className="bg-white hover:bg-[#f5f5f5]">
                    <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">
                      {c.name || "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">
                      {c.abbreviation || "—"}
                    </td>
                    <td className="border border-[#ddd] p-[10px] text-center align-middle">
                      <Link
                        href={`/Companies/Edit/${c.id}`}
                        className="text-[#666] no-underline hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      <span className="text-[#666] mx-1"> | </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="bg-transparent border-0 p-0 text-[#666] cursor-pointer text-sm underline hover:no-underline"
                      >
                        Delete
                      </button>
                    </td>
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
