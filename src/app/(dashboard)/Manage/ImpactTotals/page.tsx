"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GET_IMPACT_TOTALS_API,
  GET_ME_API,
  SAVE_IMPACT_TOTALS_API,
  type ImpactTotalsResponse,
} from "@/lib/api";

const emptyForm: ImpactTotalsResponse = {
  increasedSales: "",
  retainedSales: "",
  jobsCreated: "",
  numberJobsCreated: "",
  jobsRetained: "",
  numberJobsRetained: "",
  costAvoidanceGovtFines: "",
  timeCostReduction: "",
  investments: "",
  avoidedInvestments: "",
};

const fields: { name: keyof ImpactTotalsResponse; label: string }[] = [
  { name: "increasedSales", label: "Increased Sales" },
  { name: "retainedSales", label: "Retained Sales" },
  { name: "jobsCreated", label: "Jobs Created" },
  { name: "numberJobsCreated", label: "# Jobs Created" },
  { name: "jobsRetained", label: "Jobs Retained" },
  { name: "numberJobsRetained", label: "# Jobs Retained" },
  { name: "costAvoidanceGovtFines", label: "Cost Avoidance - Gov't Fines" },
  { name: "timeCostReduction", label: "Time Cost Reduction" },
  { name: "investments", label: "Investments" },
  { name: "avoidedInvestments", label: "Avoided Investments" },
];

export default function ImpactTotalsPage() {
  const [internId, setInternId] = useState("");
  const [form, setForm] = useState<ImpactTotalsResponse>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const me = await GET_ME_API();
      if (!me.ok) {
        setError(me.error);
        setLoading(false);
        return;
      }

      const id = me.user.id;
      setInternId(id);

      const totals = await GET_IMPACT_TOTALS_API(id);
      if (totals.ok) {
        setForm({
          ...emptyForm,
          ...Object.fromEntries(
            Object.entries(totals.data).map(([key, value]) => [
              key,
              value === null ? "" : String(value),
            ])
          ),
        } as ImpactTotalsResponse);
      } else {
        setError(totals.error);
      }

      setLoading(false);
    }

    load();
  }, []);

  function updateField(name: keyof ImpactTotalsResponse, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");

    const result = await SAVE_IMPACT_TOTALS_API(internId, form);

    if (result.ok) {
      setMessage("Impact totals saved successfully.");
    } else {
      setError(result.error);
    }

    setSaving(false);
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6">
          <Link
            href="/Manage"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] no-underline"
          >
            Back to My Account
          </Link>
        </div>

        <h2 className="text-[24px] mb-2" style={{ color: "#900", fontWeight: "normal" }}>
          Impact Totals
        </h2>

        <p className="text-[#666666] font-roboto text-sm mb-6">
          Enter the totals from your impact calculator. Leave fields blank if they do not apply.
        </p>

        {loading ? (
          <p className="text-[#666666] font-roboto">Loading…</p>
        ) : (
          <>
            {error && (
              <p id="impact-totals-error" className="text-red-600 font-roboto mb-4" role="alert">
                {error}
              </p>
            )}
            {message && <p className="text-green-700 font-roboto mb-4">{message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px]">
              {fields.map((field) => (
                <label
                  key={field.name}
                  htmlFor={`impact-${field.name}`}
                  className="flex flex-col gap-1 text-[#666666] font-roboto text-sm"
                >
                  <span>{field.label}</span>
                  <input
                    id={`impact-${field.name}`}
                    type="number"
                    step="any"
                    value={form[field.name]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-[#333333] focus:border-[#666]"
                    aria-describedby={error ? "impact-totals-error" : undefined}
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving || !internId}
              className="mt-6 px-5 py-2 rounded-md text-white disabled:opacity-60"
              style={{ backgroundColor: "#9E1B32" }}
            >
              {saving ? "Saving..." : "Save Impact Totals"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}