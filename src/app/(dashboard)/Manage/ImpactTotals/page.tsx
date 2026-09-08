"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GET_IMPACT_CALC_TOTALS_API,
  GET_IMPACT_TOTALS_API,
  GET_ME_API,
  SAVE_IMPACT_TOTALS_API,
  type ImpactTotalsResponse,
} from "@/lib/api";
import { differsFromCalc, type CalcValues } from "@/lib/impact-totals";

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
  const [prefilled, setPrefilled] = useState(false);
  const [calcValues, setCalcValues] = useState<CalcValues | null>(null);
  const [fromUpload, setFromUpload] = useState(false);

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
      if (!totals.ok) {
        setError(totals.error);
        setLoading(false);
        return;
      }

      const saved = {
        ...emptyForm,
        ...Object.fromEntries(
          Object.entries(totals.data).map(([key, value]) => [
            key,
            value === null ? "" : String(value),
          ])
        ),
      } as ImpactTotalsResponse;

      setForm(saved);
      setFromUpload(
        new URLSearchParams(window.location.search).get("fromUpload") === "1"
      );

      const calc = await GET_IMPACT_CALC_TOTALS_API(id);
      if (calc.ok && calc.data.hasAnyValue && calc.data.values) {
        setCalcValues(calc.data.values);

        // Fill the form from the calculator only when nothing has been saved,
        // so an intern's own figures are never overwritten. Where they have
        // saved something, the calculator is shown alongside each field
        // instead and they decide what to do about any difference.
        const hasSaved = Object.values(saved).some((value) => value !== "");
        if (!hasSaved) {
          setForm({
            ...emptyForm,
            ...Object.fromEntries(
              Object.entries(calc.data.values).map(([key, value]) => [
                key,
                value === null ? "" : String(value),
              ])
            ),
          } as ImpactTotalsResponse);
          setPrefilled(true);
        }
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
      setPrefilled(false);
    } else {
      setError(result.error);
    }

    setSaving(false);
  }

  const differences = calcValues
    ? fields.filter((field) =>
        differsFromCalc(String(form[field.name]), calcValues[field.name])
      )
    : [];

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
            {error && <p className="text-red-600 font-roboto mb-4">{error}</p>}
            {message && <p className="text-green-700 font-roboto mb-4">{message}</p>}

            {prefilled && (
              <div className="mb-6 max-w-[900px] border border-[#e0d4a8] bg-[#fdf8e8] rounded-md px-4 py-3">
                <p className="text-[#6b5a1f] font-roboto text-sm">
                  These figures were read from the impact calculator you uploaded.
                  Please check them against your workbook and correct anything that
                  looks wrong before saving.
                </p>
              </div>
            )}

            {!prefilled && differences.length > 0 && (
              <div className="mb-6 max-w-[900px] border border-[#e0d4a8] bg-[#fdf8e8] rounded-md px-4 py-3">
                <p className="text-[#6b5a1f] font-roboto text-sm">
                  {fromUpload
                    ? "The calculator you just uploaded reports different figures to the ones saved here."
                    : "Some of these figures differ from your uploaded impact calculator."}{" "}
                  The calculator&rsquo;s value is shown under each field that differs.
                  Nothing has been changed for you &mdash; update anything that needs
                  correcting, then save.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px]">
              {fields.map((field) => {
                const calcValue = calcValues?.[field.name] ?? null;
                const differs = differsFromCalc(String(form[field.name]), calcValue);

                return (
                  <div key={field.name} className="flex flex-col gap-1">
                    <label className="flex flex-col gap-1 text-[#666666] font-roboto text-sm">
                      <span>{field.label}</span>
                      <input
                        type="number"
                        step="any"
                        value={form[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-[#333333]"
                      />
                    </label>
                    {differs && calcValue !== null && (
                      <span className="text-[12px] text-[#6b5a1f] font-roboto">
                        Calculator: {calcValue}
                        <button
                          type="button"
                          onClick={() => updateField(field.name, String(calcValue))}
                          className="ml-2 underline"
                        >
                          use this
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}
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