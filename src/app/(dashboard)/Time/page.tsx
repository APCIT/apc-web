"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  GET_TIME_WEEK_API,
  POST_TIME_UPDATE_API,
  PATCH_INTERN_HOMETOWN_API,
  PATCH_INTERN_MENTOR_API,
  type TimeWeekResponse,
  type TimeWeekRow,
} from "@/lib/api";

const selectClass =
  "px-2 py-1 border border-[#999] rounded text-[14px] font-roboto text-[#333] bg-white focus:border-[#666]";
const mobileHourSelectClass =
  "time-log-field time-log-hour-select px-2.5 py-2 text-[16px] text-[#212124] bg-white";
const mobileMinuteSelectClass =
  "time-log-field time-log-minute-select px-2 py-2 text-[16px] text-[#212124] bg-white";
const mobileLunchSelectClass =
  "time-log-field time-log-lunch-select px-3 py-2 text-[16px] text-[#212124] bg-white";
const backButtonClass =
  "inline-flex items-center justify-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

/** Desktop / modal outline button (existing dashboard style). */
const actionButtonClass =
  "inline-flex items-center justify-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

/** Public-site primary pill CTA. */
const primaryPillClass =
  "inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-[#9E1B32] text-white font-proxima text-[16px] font-semibold border-0 shadow-[0_6px_16px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#821E2E] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[#9E1B32]";

/** Public-site secondary outline pill. */
const secondaryPillClass =
  "inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-full bg-white text-[#9E1B32] font-proxima text-[14px] font-semibold border-2 border-[#9E1B32] transition-all duration-300 hover:bg-[#9E1B32] hover:text-white";

const detailsInputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:border-[#666] h-[40px]";

const skeletonStyle = {
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Date display: "Monday 02/24" (dddd MM/dd) */
function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${weekday} ${mm}/${dd}`;
}

function getDayName(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" });
}

/** Start hour: 4–19 (24h); display as 12h. */
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
  { value: "30", label: "30 Min" },
  { value: "45", label: "45 Min" },
  { value: "60", label: "1 Hour" },
];

type RowState = {
  date: string;
  id: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  lunch: string;
  description: string;
};

function buildRowState(date: string, entry: TimeWeekResponse["thisWeek"][number]): RowState {
  if (!entry || !entry.id) {
    return {
      date,
      id: "",
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
      lunch: "0",
      description: "",
    };
  }
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  const lunchMinutes = Math.round((entry.lunch ?? 0) * 60);
  return {
    date,
    id: entry.id,
    startHour: String(start.getUTCHours()).padStart(2, "0"),
    startMinute: String(start.getUTCMinutes()).padStart(2, "0"),
    endHour: String(end.getUTCHours()).padStart(2, "0"),
    endMinute: String(end.getUTCMinutes()).padStart(2, "0"),
    lunch: String(lunchMinutes),
    description: entry.description ?? "",
  };
}

/** Compute 7 dates (Sun–Sat) from weekStart yyyy-MM-dd. */
function weekDates(weekStart: string): string[] {
  const d = new Date(weekStart + "T12:00:00");
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${dd}`);
  }
  return out;
}

function TimePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") ?? null;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<TimeWeekResponse | null>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedHours, setSavedHours] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const hometownDisclosure = useDisclosure();
  const mentorDisclosure = useDisclosure();
  const saveModalDisclosure = useDisclosure();
  const [hometownValue, setHometownValue] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [mentorTitle, setMentorTitle] = useState("");
  const [mentorPhone, setMentorPhone] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [hometownSaving, setHometownSaving] = useState(false);
  const [mentorSaving, setMentorSaving] = useState(false);
  const [hometownError, setHometownError] = useState<string | null>(null);
  const [mentorError, setMentorError] = useState<string | null>(null);

  const fetchWeek = useCallback(
    async (date: string | null) => {
      setLoading(true);
      setLoadError(null);
      const res = await GET_TIME_WEEK_API(date ?? undefined);
      setLoading(false);
      if (!res.ok) {
        setLoadError(res.error ?? "Failed to load");
        if (res.status === 403 || res.status === 401) {
          router.replace("/");
        }
        return;
      }
      setData(res.data);
      const dates = weekDates(res.data.weekStart);
      const newRows = dates.map((d, i) =>
        buildRowState(d, res.data.thisWeek[i] ?? { id: "", start: "", end: "", description: null, lunch: 0, hours: 0 })
      );
      setRows(newRows);
      setHometownValue(res.data.intern.hometown ?? "");
      setMentorName(res.data.intern.mentorName ?? "");
      setMentorTitle(res.data.intern.mentorTitle ?? "");
      setMentorPhone(res.data.intern.mentorPhone ?? "");
      setMentorEmail(res.data.intern.mentorEmail ?? "");
    },
    [router]
  );

  useEffect(() => {
    fetchWeek(dateParam);
  }, [dateParam, fetchWeek]);

  const changeWeek = useCallback(
    (newDate: string) => {
      router.push(`/Time?date=${encodeURIComponent(newDate)}`);
    },
    [router]
  );

  const setRow = useCallback((index: number, updater: (prev: RowState) => RowState) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = updater(prev[index]);
      return next;
    });
  }, []);

  const clearRow = useCallback(
    (index: number) => {
      setRow(index, (r) => ({
        ...r,
        id: "",
        startHour: "",
        startMinute: "",
        endHour: "",
        endMinute: "",
        lunch: "0",
        description: "",
      }));
    },
    [setRow]
  );

  const handleSave = async () => {
    setSaveError(null);
    setSuccessMessage(false);
    setSavedHours(null);

    const mentorNameVal = data?.intern?.mentorName?.trim() ?? "";
    const mentorPhoneVal = data?.intern?.mentorPhone?.trim() ?? "";
    const mentorEmailVal = data?.intern?.mentorEmail?.trim() ?? "";
    if (!mentorNameVal || !mentorPhoneVal || !mentorEmailVal) {
      alert(
        'You need to update your mentor information! Click "Mentor Info" in the top right corner of this page.'
      );
      return;
    }

    setSaving(true);
    saveModalDisclosure.onOpen();

    const week: TimeWeekRow[] = rows.map((r) => ({
      Id: r.id || undefined,
      Date: r.date,
      StartHour: r.startHour || null,
      StartMinute: r.startMinute || null,
      EndHour: r.endHour || null,
      EndMinute: r.endMinute || null,
      Description: r.description.trim() || null,
      Lunch: r.lunch === "0" ? 0 : Number(r.lunch),
    }));
    const res = await POST_TIME_UPDATE_API(week);
    setSaving(false);
    if (!res.ok) {
      setSaveError(res.error ?? "Failed to save");
      return;
    }
    setSuccessMessage(true);
    setSavedHours(res.hours ?? null);
    setSaveError(null);
  };

  const onHometownOpen = () => {
    setHometownValue(data?.intern?.hometown ?? "");
    setHometownError(null);
    hometownDisclosure.onOpen();
  };
  const onMentorOpen = () => {
    setMentorName(data?.intern?.mentorName ?? "");
    setMentorTitle(data?.intern?.mentorTitle ?? "");
    setMentorPhone(data?.intern?.mentorPhone ?? "");
    setMentorEmail(data?.intern?.mentorEmail ?? "");
    setMentorError(null);
    mentorDisclosure.onOpen();
  };

  const saveHometown = async () => {
    if (!data?.intern?.id) return;
    const value = hometownValue.trim();
    setHometownSaving(true);
    setHometownError(null);
    const res = await PATCH_INTERN_HOMETOWN_API(data.intern.id, value);
    setHometownSaving(false);
    if (res.ok) {
      setHometownValue(value);
      setData((prev) =>
        prev ? { ...prev, intern: { ...prev.intern, hometown: value || null } } : null
      );
      hometownDisclosure.onClose();
    } else {
      setHometownError(res.error ?? "Failed to update");
    }
  };

  const saveMentor = async () => {
    if (!data?.intern?.id) return;
    const name = mentorName.trim();
    const title = mentorTitle.trim();
    const phoneDigits = mentorPhone.replace(/\D/g, "");
    const email = mentorEmail.trim();
    if (!name) {
      setMentorError("Mentor name is required.");
      return;
    }
    if (!title) {
      setMentorError("Job title is required.");
      return;
    }
    if (phoneDigits.length !== 10) {
      setMentorError("Phone must be exactly 10 digits.");
      return;
    }
    if (!email) {
      setMentorError("Email is required.");
      return;
    }
    setMentorSaving(true);
    setMentorError(null);
    const res = await PATCH_INTERN_MENTOR_API(data.intern.id, {
      mentorName: name,
      mentorTitle: title,
      mentorPhone: mentorPhone,
      mentorEmail: email,
    });
    setMentorSaving(false);
    if (res.ok) {
      setData((prev) =>
        prev
          ? {
              ...prev,
              intern: {
                ...prev.intern,
                mentorName: name || null,
                mentorTitle: title || null,
                mentorPhone: phoneDigits || null,
                mentorEmail: email || null,
              },
            }
          : null
      );
      mentorDisclosure.onClose();
    } else {
      setMentorError(res.error ?? "Failed to update");
    }
  };

  const weekStart = data?.weekStart ?? "";
  const weekEnd = data?.weekEnd ?? "";
  const currentWeek = data?.currentWeek ?? true;
  const nextWeek = data?.nextWeek ?? false;

  const weekStartDate = weekStart ? new Date(weekStart + "T12:00:00") : null;
  const prevWeekDate = weekStartDate ? new Date(weekStartDate) : null;
  if (prevWeekDate) prevWeekDate.setDate(prevWeekDate.getDate() - 7);
  const nextWeekDate = weekStartDate ? new Date(weekStartDate) : null;
  if (nextWeekDate) nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  const prevWeekStr =
    prevWeekDate &&
    `${prevWeekDate.getFullYear()}-${String(prevWeekDate.getMonth() + 1).padStart(2, "0")}-${String(prevWeekDate.getDate()).padStart(2, "0")}`;
  const nextWeekStr =
    nextWeekDate &&
    `${nextWeekDate.getFullYear()}-${String(nextWeekDate.getMonth() + 1).padStart(2, "0")}-${String(nextWeekDate.getDate()).padStart(2, "0")}`;

  const weekStartDateForRange = weekStart ? new Date(weekStart + "T12:00:00") : null;
  const weekEndDateForRange = weekStartDateForRange ? new Date(weekStartDateForRange) : null;
  if (weekEndDateForRange) weekEndDateForRange.setDate(weekEndDateForRange.getDate() + 6);
  const rangeDisplay =
    weekStartDateForRange && weekEndDateForRange
      ? `${weekStartDateForRange.toLocaleDateString("en-US", { month: "long" })} ${weekStartDateForRange.getDate()} – ${weekEndDateForRange.toLocaleDateString("en-US", { month: "long" })} ${weekEndDateForRange.getDate()}`
      : "—";

  const renderTimeSelects = (row: RowState, index: number, which: "start" | "end") => {
    const hourKey = which === "start" ? "startHour" : "endHour";
    const minuteKey = which === "start" ? "startMinute" : "endMinute";
    const hours = which === "start" ? START_HOUR_OPTIONS : END_HOUR_OPTIONS;
    return (
      <div className="time-log-time-row">
        <select
          className={mobileHourSelectClass}
          value={row[hourKey]}
          onChange={(e) => setRow(index, (r) => ({ ...r, [hourKey]: e.target.value }))}
          aria-label={`${which === "start" ? "Start" : "End"} hour ${row.date}`}
        >
          {hours.map((o) => (
            <option key={o.value || "blank"} value={o.value}>
              {o.label || "Hour"}
            </option>
          ))}
        </select>
        <span className="time-log-time-colon" aria-hidden>
          :
        </span>
        <select
          className={mobileMinuteSelectClass}
          value={row[minuteKey]}
          onChange={(e) => setRow(index, (r) => ({ ...r, [minuteKey]: e.target.value }))}
          aria-label={`${which === "start" ? "Start" : "End"} minute ${row.date}`}
        >
          {MINUTE_OPTIONS.map((o) => (
            <option key={o.value || "blank"} value={o.value}>
              {o.label || "Min"}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="time-log-page w-full">
      <div className="time-log-page-inner">
        <div className="time-log-header">
          <h2 className="time-log-title m-0">This Week</h2>
          <div className="time-log-title-line" aria-hidden />
          {loading ? (
            <div className="mx-auto h-5 w-[180px] rounded mt-2" style={skeletonStyle} aria-hidden />
          ) : loadError && !data ? (
            <p className="text-red-600 font-proxima text-sm mt-2">{loadError}</p>
          ) : (
            <p className="time-log-range m-0 mt-2 leading-snug">{rangeDisplay}</p>
          )}
          <p role="status" className="time-log-note time-log-mobile-only">
            <span style={{ fontWeight: 600, color: "#9E1B32" }}>Note:</span> entries need a
            description and lunch selection to save.
          </p>
          <p
            className="time-log-desktop-only font-roboto mx-auto leading-none"
            style={{ fontSize: "36px", color: "#000000", marginTop: "2px" }}
          >
            **YOUR TIME LOGS WILL NOT SAVE WITHOUT A DESCRIPTION OR LUNCH**
          </p>
          {loadError && !data && (
            <div className="mt-5 text-center time-log-mobile-only">
              <Link href="/" className={secondaryPillClass}>
                Go to Home
              </Link>
            </div>
          )}
          {loadError && !data && (
            <div style={{ marginTop: "2px" }} className="text-center time-log-desktop-only">
              <Link href="/" className={backButtonClass}>
                Go to Home
              </Link>
            </div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="time-log-desktop-only time-log-desktop-actions items-center justify-between mb-4 font-roboto">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className={actionButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onHometownOpen} className={actionButtonClass}>
              Hometown
            </button>
            <button type="button" onClick={onMentorOpen} className={actionButtonClass}>
              Mentor Info
            </button>
          </div>
        </div>

        {/* Mobile actions — public pill CTAs */}
        <div className="time-log-mobile-only time-log-mobile-actions">
          <div className="time-log-mobile-actions-row">
            <button
              type="button"
              onClick={onHometownOpen}
              className={secondaryPillClass + " flex-1"}
            >
              Hometown
            </button>
            <button
              type="button"
              onClick={onMentorOpen}
              className={secondaryPillClass + " flex-1"}
            >
              Mentor Info
            </button>
          </div>
        </div>

        {/* Mobile: day cards */}
        <div className="time-log-mobile-only time-log-day-list">
          {loading
            ? Array.from({ length: 7 }, (_, i) => (
                <div key={`mobile-skel-${i}`} className="time-log-day-card" aria-hidden>
                  <div className="time-log-day-accent" />
                  <div className="time-log-day-body">
                    <div className="time-log-day-top">
                      <div>
                        <h3
                          className="m-0 leading-tight"
                          style={{
                            fontFamily: "proxima-nova, sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#212124",
                          }}
                        >
                          {DAY_NAMES[i]}
                        </h3>
                        <div
                          style={{ ...skeletonStyle, width: 52, height: 16, marginTop: 8 }}
                        />
                      </div>
                      <div style={{ ...skeletonStyle, width: 68, height: 36, borderRadius: 999 }} />
                    </div>
                    <div className="time-log-day-fields">
                      <div className="time-log-time-lunch-grid">
                        <div>
                          <div
                            style={{ ...skeletonStyle, width: 72, height: 14, marginBottom: 10 }}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ ...skeletonStyle, width: 92, height: 44 }} />
                            <div style={{ ...skeletonStyle, width: 68, height: 44 }} />
                          </div>
                        </div>
                        <div>
                          <div
                            style={{ ...skeletonStyle, width: 48, height: 14, marginBottom: 10 }}
                          />
                          <div style={{ ...skeletonStyle, width: 124, height: 44 }} />
                        </div>
                        <div>
                          <div
                            style={{ ...skeletonStyle, width: 64, height: 14, marginBottom: 10 }}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ ...skeletonStyle, width: 92, height: 44 }} />
                            <div style={{ ...skeletonStyle, width: 68, height: 44 }} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{ ...skeletonStyle, width: 88, height: 14, marginBottom: 10 }}
                        />
                        <div style={{ ...skeletonStyle, width: "100%", height: 120 }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : rows.map((row, index) => (
                <article key={row.date} className="time-log-day-card">
                  <div className="time-log-day-accent" aria-hidden />
                  <div className="time-log-day-body">
                    <div className="time-log-day-top">
                      <div>
                        <h3
                          className="m-0 leading-tight"
                          style={{
                            fontFamily: "proxima-nova, sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#212124",
                          }}
                        >
                          {getDayName(row.date)}
                        </h3>
                        <p
                          className="m-0"
                          style={{
                            fontFamily: "proxima-nova, sans-serif",
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#35363B",
                            marginTop: 6,
                          }}
                        >
                          {formatDateDisplay(row.date).split(" ")[1]}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="time-log-clear-btn"
                        onClick={() => clearRow(index)}
                        aria-label={`Clear ${row.date}`}
                      >
                        Clear
                      </button>
                    </div>

                    <div className="time-log-day-fields">
                      <div className="time-log-time-lunch-grid">
                        <div>
                          <label className="time-log-field-block-label">Start Time</label>
                          {renderTimeSelects(row, index, "start")}
                        </div>
                        <div>
                          <label
                            htmlFor={`lunch-mobile-${row.date}`}
                            className="time-log-field-block-label"
                          >
                            Lunch
                          </label>
                          <select
                            id={`lunch-mobile-${row.date}`}
                            className={mobileLunchSelectClass}
                            value={row.lunch}
                            onChange={(e) =>
                              setRow(index, (r) => ({ ...r, lunch: e.target.value }))
                            }
                          >
                            {LUNCH_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="time-log-field-block-label">End Time</label>
                          {renderTimeSelects(row, index, "end")}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`desc-mobile-${row.date}`}
                          className="time-log-field-block-label"
                        >
                          Description
                        </label>
                        <textarea
                          id={`desc-mobile-${row.date}`}
                          className="time-log-field time-log-desc-area"
                          rows={4}
                          value={row.description}
                          onChange={(e) =>
                            setRow(index, (r) => ({ ...r, description: e.target.value }))
                          }
                          placeholder="What did you work on?"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
        </div>

        {/* Mobile sticky save — always reachable */}
        <div className="time-log-sticky-bar">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className={primaryPillClass + " w-full"}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Desktop: table */}
        <div className="time-log-desktop-only mb-5">
          <div className="overflow-x-auto">
            <table className="w-full max-w-full border-collapse font-roboto text-sm">
              <thead>
                <tr className="bg-[#9E1B32]">
                  <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    Date
                  </th>
                  <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    Start Time
                  </th>
                  <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    End Time
                  </th>
                  <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    Lunch
                  </th>
                  <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    Description
                  </th>
                  <th className="bg-[#9E1B32] border border-[#7a0000] p-[5px] text-white font-normal text-center">
                    Clear
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 7 }, (_, i) => (
                      <tr key={`skeleton-${i}`} className="bg-white h-[80px]">
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="text-[18px] font-normal mb-1 text-black">{DAY_NAMES[i]}</div>
                          <div
                            className="flex items-center justify-center gap-1 mt-1"
                            style={{ minHeight: "20px" }}
                            aria-hidden
                          >
                            <div style={{ ...skeletonStyle, width: "28px", height: "14px" }} />
                            <span className="text-transparent select-none text-xs">/</span>
                            <div style={{ ...skeletonStyle, width: "28px", height: "14px" }} />
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <div style={{ ...skeletonStyle, width: 80, height: 34 }} aria-hidden />
                            <div style={{ ...skeletonStyle, width: 70, height: 34 }} aria-hidden />
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <div style={{ ...skeletonStyle, width: 80, height: 34 }} aria-hidden />
                            <div style={{ ...skeletonStyle, width: 70, height: 34 }} aria-hidden />
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div style={{ ...skeletonStyle, width: 140, height: 34, margin: "0 auto" }} aria-hidden />
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] align-middle text-center">
                          <div style={{ ...skeletonStyle, width: 280, height: 60, margin: "0 auto" }} aria-hidden />
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div style={{ ...skeletonStyle, width: 24, height: 24, margin: "0 auto" }} aria-hidden />
                        </td>
                      </tr>
                    ))
                  : rows.map((row, index) => (
                      <tr key={row.date} className="bg-white hover:bg-[#f5f5f5] h-[80px]">
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="text-[18px] font-normal mb-1 text-[#555555]">
                            {getDayName(row.date)}
                          </div>
                          <div className="text-[#555555] text-xs">
                            {formatDateDisplay(row.date).split(" ")[1]}
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <select
                              className={selectClass + " max-w-[80px]"}
                              value={row.startHour}
                              onChange={(e) =>
                                setRow(index, (r) => ({ ...r, startHour: e.target.value }))
                              }
                              aria-label={`Start hour ${row.date}`}
                            >
                              {START_HOUR_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>
                                  {o.label || "Hour"}
                                </option>
                              ))}
                            </select>
                            <span style={{ color: "#000000" }}>:</span>
                            <select
                              className={selectClass + " max-w-[70px]"}
                              value={row.startMinute}
                              onChange={(e) =>
                                setRow(index, (r) => ({ ...r, startMinute: e.target.value }))
                              }
                              aria-label={`Start minute ${row.date}`}
                            >
                              {MINUTE_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>
                                  {o.label || "Min"}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <select
                              className={selectClass + " max-w-[80px]"}
                              value={row.endHour}
                              onChange={(e) =>
                                setRow(index, (r) => ({ ...r, endHour: e.target.value }))
                              }
                              aria-label={`End hour ${row.date}`}
                            >
                              {END_HOUR_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>
                                  {o.label || "Hour"}
                                </option>
                              ))}
                            </select>
                            <span style={{ color: "#000000" }}>:</span>
                            <select
                              className={selectClass + " max-w-[70px]"}
                              value={row.endMinute}
                              onChange={(e) =>
                                setRow(index, (r) => ({ ...r, endMinute: e.target.value }))
                              }
                              aria-label={`End minute ${row.date}`}
                            >
                              {MINUTE_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>
                                  {o.label || "Min"}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <select
                            className={selectClass + " w-[140px] max-w-[280px]"}
                            value={row.lunch}
                            onChange={(e) =>
                              setRow(index, (r) => ({ ...r, lunch: e.target.value }))
                            }
                            aria-label={`Lunch ${row.date}`}
                          >
                            {LUNCH_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] align-middle text-center">
                          <textarea
                            className="w-[280px] max-w-[280px] px-2 py-1 border border-[#999] rounded text-[#333] text-sm bg-white resize overflow-auto mx-auto block font-roboto"
                            rows={3}
                            cols={40}
                            value={row.description}
                            onChange={(e) =>
                              setRow(index, (r) => ({ ...r, description: e.target.value }))
                            }
                            aria-label={`Description ${row.date}`}
                          />
                        </td>
                        <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                          <button
                            type="button"
                            className="px-[5px] py-[1px] text-[12px] leading-[1.5] rounded-[3px] text-[#333] bg-white border border-[#ccc] hover:bg-[#e6e6e6]"
                            onClick={() => clearRow(index)}
                            aria-label={`Clear ${row.date}`}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap mt-2 mb-2">
          <div className="flex items-center gap-3 flex-wrap w-full">
            {currentWeek && prevWeekStr && (
              <>
                <button
                  type="button"
                  onClick={() => changeWeek(prevWeekStr)}
                  className={secondaryPillClass + " time-log-mobile-only w-full"}
                >
                  ← Prev Week
                </button>
                <button
                  type="button"
                  onClick={() => changeWeek(prevWeekStr)}
                  className={backButtonClass + " time-log-desktop-only no-underline"}
                >
                  &laquo;&laquo; Prev Week
                </button>
              </>
            )}
          </div>
          {nextWeek && nextWeekStr && (
            <>
              <button
                type="button"
                onClick={() => changeWeek(nextWeekStr)}
                className={secondaryPillClass + " time-log-mobile-only w-full"}
              >
                Next Week →
              </button>
              <button
                type="button"
                onClick={() => changeWeek(nextWeekStr)}
                className={backButtonClass + " time-log-desktop-only no-underline"}
              >
                Next Week &raquo;&raquo;
              </button>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={hometownDisclosure.isOpen} onOpenChange={hometownDisclosure.onOpenChange} hideCloseButton>
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">Hometown</h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>*A response is required or data will not be saved.</p>
          </ModalHeader>
          <ModalBody className="gap-4 flex flex-col items-center" style={{ paddingBottom: 24 }}>
            <div className="flex items-center font-roboto justify-center">
              <label htmlFor="hometown-state" className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Home State/Country: </label>
              <input
                id="hometown-state"
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={hometownValue}
                onChange={(e) => setHometownValue(e.target.value)}
                required
                aria-required="true"
                aria-invalid={!!hometownError}
                aria-describedby={hometownError ? "hometown-error" : undefined}
              />
            </div>
            {hometownError && (
              <p id="hometown-error" role="alert" className="text-red-600 text-sm font-roboto text-center w-full">{hometownError}</p>
            )}
          </ModalBody>
          <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
            <button
              type="button"
              onClick={hometownDisclosure.onClose}
              className={actionButtonClass}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveHometown}
              disabled={hometownSaving}
              className={actionButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {hometownSaving ? "Saving…" : "Save"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={saveModalDisclosure.isOpen}
        onOpenChange={(open) => {
          if (open) {
            saveModalDisclosure.onOpen();
          } else {
            saveModalDisclosure.onClose();
            setSaving(false);
            setSaveError(null);
            setSuccessMessage(false);
            setSavedHours(null);
          }
        }}
        hideCloseButton
      >
        <ModalContent className="max-w-[380px] w-[calc(100%-2rem)] mx-auto">
          <ModalBody
            className="flex flex-col items-center justify-center"
            style={{
              fontFamily: "Roboto, sans-serif",
              color: "#000000",
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 28,
              paddingRight: 28,
              gap: 16,
            }}
          >
            {saving ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 400, color: "#000000", textAlign: "center", margin: 0 }}>
                  Saving Timesheet...
                </p>
                <div
                  aria-hidden
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    border: "3px solid #e5e7eb",
                    borderTopColor: "#900",
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            ) : saveError ? (
              <>
                <p
                  role="alert"
                  style={{ color: "#b91c1c", fontSize: 15, fontWeight: 400, textAlign: "center", margin: 0, lineHeight: 1.5 }}
                >
                  {saveError}
                </p>
                <button
                  type="button"
                  onClick={saveModalDisclosure.onClose}
                  className={actionButtonClass}
                >
                  Close
                </button>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                }}
              >
                <p style={{ fontSize: 22, fontWeight: 400, color: "#000000", textAlign: "center", margin: 0, lineHeight: 1.4 }}>
                  Timesheet saved!
                </p>
                {savedHours != null && (
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: "#000000",
                      textAlign: "center",
                      margin: 0,
                      lineHeight: 1.5,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "0.4rem 0.45rem",
                    }}
                  >
                    <span>You have logged</span>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{savedHours}</span>
                    <span>hours this week!</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={saveModalDisclosure.onClose}
                  className={actionButtonClass}
                >
                  Close
                </button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={mentorDisclosure.isOpen} onOpenChange={mentorDisclosure.onOpenChange} hideCloseButton>
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">Mentor Information</h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>*All fields are required and must be valid, or data will not be saved.</p>
          </ModalHeader>
          <ModalBody className="gap-4 flex flex-col items-center" style={{ paddingBottom: 24 }}>
            <div className="flex items-center font-roboto justify-center">
              <label htmlFor="mentor-name" className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Name: </label>
              <input
                id="mentor-name"
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
                aria-required="true"
                autoComplete="name"
              />
            </div>
            <div className="flex items-center font-roboto justify-center">
              <label htmlFor="mentor-title" className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Job Title: </label>
              <input
                id="mentor-title"
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorTitle}
                onChange={(e) => setMentorTitle(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div className="flex items-center font-roboto justify-center">
              <label htmlFor="mentor-phone" className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Phone: </label>
              <input
                id="mentor-phone"
                type="tel"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorPhone}
                onChange={(e) => setMentorPhone(e.target.value)}
                required
                aria-required="true"
                autoComplete="tel"
                aria-describedby="mentor-phone-help"
              />
            </div>
            <p id="mentor-phone-help" className="text-[12px] font-roboto text-[#4A4C54] text-center w-full -mt-2">
              Ex: (555) 555-5555
            </p>
            <div className="flex items-center font-roboto justify-center">
              <label htmlFor="mentor-email" className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Email: </label>
              <input
                id="mentor-email"
                type="email"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                required
                aria-required="true"
                autoComplete="email"
              />
            </div>
            {mentorError && (
              <p id="mentor-error" role="alert" className="text-red-600 text-sm font-roboto text-center w-full">{mentorError}</p>
            )}
          </ModalBody>
          <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
            <button
              type="button"
              onClick={mentorDisclosure.onClose}
              className={actionButtonClass}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveMentor}
              disabled={mentorSaving}
              className={actionButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {mentorSaving ? "Saving…" : "Save"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function TimePage() {
  return (
    <Suspense
      fallback={
        <div className="time-log-page w-full">
          <div className="time-log-page-inner text-center text-[#55565a]">Loading…</div>
        </div>
      }
    >
      <TimePageContent />
    </Suspense>
  );
}
