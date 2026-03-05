"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GET_INTERN_DETAIL_API, CREATE_TIMELOG_API } from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const selectClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px] bg-white";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

/** Date display: "Monday 02/24" (dddd MM/dd) */
function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${weekday} ${mm}/${dd}`;
}

function startOfWeekStr(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() - d.getDay());
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Start hour: 4–19 (24h); display as 12h (4–7 AM, 8–11 AM, 12 PM, 1–7 PM). */
const START_HOUR_OPTIONS = (() => {
  const out: { value: string; label: string }[] = [{ value: "", label: "" }];
  for (let h = 4; h <= 19; h++) {
    const hour12 = h === 12 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? "AM" : "PM";
    out.push({ value: String(h).padStart(2, "0"), label: `${hour12} ${ampm}` });
  }
  return out;
})();

/** End hour: 5–23 (24h), 12h display. */
const END_HOUR_OPTIONS = (() => {
  const out: { value: string; label: string }[] = [{ value: "", label: "" }];
  for (let h = 5; h <= 23; h++) {
    const hour12 = h === 12 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? "AM" : "PM";
    out.push({ value: String(h).padStart(2, "0"), label: `${hour12} ${ampm}` });
  }
  return out;
})();

const MINUTE_OPTIONS = [
  { value: "", label: "" },
  { value: "00", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

const LUNCH_OPTIONS = [
  { value: "0", label: "No Lunch" },
  { value: "15", label: "15 Min" },
  { value: "30", label: "30 Min" },
  { value: "45", label: "45 Min" },
  { value: "60", label: "1 Hour" },
  { value: "75", label: "1 Hour & 15 Min" },
];

function TimeCreateContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const date = searchParams.get("date") ?? "";

  const [internName, setInternName] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [lunch, setLunch] = useState("0");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    GET_INTERN_DETAIL_API(id).then((res) => {
      if (res.ok) {
        const i = res.data.intern;
        setInternName(`${i.firstName} ${i.lastName}`.trim() || "Intern");
      }
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Date is required.");
      return;
    }
    if (!startHour || !startMinute) {
      setError("Start time is required.");
      return;
    }
    if (!endHour || !endMinute) {
      setError("End time is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;
    const startMinutes = parseInt(startHour, 10) * 60 + parseInt(startMinute, 10);
    const endMinutes = parseInt(endHour, 10) * 60 + parseInt(endMinute, 10);
    if (endMinutes <= startMinutes) {
      setError("End time must be after start time.");
      return;
    }

    setSubmitting(true);
    const res = await CREATE_TIMELOG_API(id, {
      date,
      startTime,
      endTime,
      lunch: Number(lunch),
      description: description.trim(),
    });
    setSubmitting(false);

    if (res.ok) {
      const weekSunday = startOfWeekStr(date);
      router.push(`/Interns/Details/${encodeURIComponent(id)}?date=${weekSunday}`);
      return;
    }
    setError(res.error ?? "Failed to save.");
  }

  if (!date) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <div style={{ height: "20px" }} />
          <div className="text-center text-red-600 mb-6">Missing date parameter.</div>
          <div>
            <Link
              href={`/Interns/Details/${encodeURIComponent(id)}`}
              className={backButtonClass}
              style={{ fontWeight: "normal", textDecoration: "none" }}
            >
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back to Details
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

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/Interns/Details/${encodeURIComponent(id)}`}
              className={backButtonClass}
              style={{ fontWeight: "normal", textDecoration: "none" }}
            >
              <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
              Back to Details
            </Link>
            <h2
              className="text-[30px] font-roboto"
              style={{ fontWeight: "normal", color: "#000000", marginLeft: "24px" }}
            >
              {internName ? `${internName} - Add Timelog` : "Add Timelog"}
            </h2>
          </div>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Date (read-only) */}
          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>Date</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                type="text"
                value={formatDateDisplay(date)}
                readOnly
                disabled
                className={inputClass + " w-[220px] bg-gray-100 text-[#666]"}
              />
            </div>
          </div>

          {/* Start Time: Hour + Minute */}
          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>Start Time</label>
            <div className="flex-1 flex items-center gap-2" style={{ marginLeft: "20px" }}>
              <select
                id="startHour"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className={selectClass}
                aria-label="Start hour"
              >
                {START_HOUR_OPTIONS.map((o) => (
                  <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                ))}
              </select>
              <span className="text-[#666]">:</span>
              <select
                id="startMinute"
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className={selectClass}
                aria-label="Start minute"
              >
                {MINUTE_OPTIONS.map((o) => (
                  <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* End Time: Hour + Minute */}
          <div className="flex items-center" style={rowStyle}>
            <label className={labelClass}>End Time</label>
            <div className="flex-1 flex items-center gap-2" style={{ marginLeft: "20px" }}>
              <select
                id="endHour"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className={selectClass}
                aria-label="End hour"
              >
                {END_HOUR_OPTIONS.map((o) => (
                  <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                ))}
              </select>
              <span className="text-[#666]">:</span>
              <select
                id="endMinute"
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className={selectClass}
                aria-label="End minute"
              >
                {MINUTE_OPTIONS.map((o) => (
                  <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lunch */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="lunch" className={labelClass}>Lunch</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <select
                id="lunch"
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className={selectClass}
              >
                {LUNCH_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start" style={rowStyle}>
            <label htmlFor="description" className={labelClass + " mt-2"}>Description</label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full max-w-[90ch] min-w-[400px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666]"
                rows={7}
                placeholder="Description (required)"
              />
            </div>
          </div>

          {/* Submit: Save Changes (forest green) */}
          <div className="flex items-center mt-4 gap-4 flex-wrap">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3 items-center flex-wrap" style={{ marginLeft: "20px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-[16px] py-[8px] rounded-[10px] text-white text-[14px] font-normal text-center cursor-pointer select-none border border-[#1a6b1a] bg-[#228B22] hover:bg-[#1a6b1a] disabled:opacity-70"
              >
                {submitting ? "Saving…" : "Save Changes"}
              </button>
              {error && (
                <span className="p-3 rounded bg-red-50 text-sm" style={{ color: "#b91c1c" }}>{error}</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TimeCreatePage() {
  return (
    <Suspense>
      <TimeCreateContent />
    </Suspense>
  );
}
