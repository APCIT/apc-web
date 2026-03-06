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
  "px-2 py-1 border border-[#999] rounded text-[14px] font-roboto text-[#333] bg-white focus:outline-none focus:border-[#666]";
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

const actionButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

const detailsInputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";

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
  { value: "15", label: "15 Min" },
  { value: "30", label: "30 Min" },
  { value: "45", label: "45 Min" },
  { value: "60", label: "1 Hour" },
  { value: "75", label: "1 Hour & 15 Min" },
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

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="py-8 px-[100px]">
        <div className="text-center" style={{ marginBottom: "4px" }}>
          <h2 className="font-roboto mx-auto leading-none" style={{ fontSize: "30px", fontWeight: "normal", color: "#000000", marginBottom: "6px" }}>
            This Week
          </h2>
          {loading ? (
            <div
              className="mx-auto h-5 w-[180px] rounded"
              style={{ ...skeletonStyle, marginTop: "2px" }}
              aria-hidden
            />
          ) : loadError && !data ? (
            <p className="text-red-600 font-roboto text-sm" style={{ marginTop: "2px" }}>{loadError}</p>
          ) : (
            <p className="text-[#555555] font-roboto leading-none" style={{ fontSize: "18px", marginTop: "2px" }}>{rangeDisplay}</p>
          )}
          <p className="font-roboto mx-auto leading-none" style={{ fontSize: "36px", color: "#000000", marginTop: "2px" }}>
            **YOUR TIME LOGS WILL NOT SAVE WITHOUT A DESCRIPTION OR LUNCH**
          </p>
          {loadError && !data && (
            <div style={{ marginTop: "2px" }} className="text-center">
              <Link href="/" className={backButtonClass}>
                Go to Home
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 font-roboto">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className={actionButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onHometownOpen}
              className={actionButtonClass + " no-underline"}
            >
              Hometown
            </button>
            <button
              type="button"
              onClick={onMentorOpen}
              className={actionButtonClass + " no-underline"}
              style={{ marginLeft: "12px" }}
            >
              Mentor Info
            </button>
          </div>
        </div>

        <div style={{ height: "28px" }} aria-hidden />

        <div className="mb-5">
          <div className="overflow-x-auto">
            <table className="w-full max-w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Date</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Lunch</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Description</th>
                <th className="bg-[#9E1B32] border border-[#7a0000] p-[5px] text-white font-normal text-center">
                  Clear
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 7 }, (_, i) => (
                  <tr key={`skeleton-${i}`} className="bg-white h-[80px]">
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="text-[18px] font-normal mb-1" style={{ color: "#000000" }}>
                        {DAY_NAMES[i]}
                      </div>
                      <div
                        className="flex items-center justify-center gap-1 mt-1"
                        style={{ minHeight: "20px" }}
                        aria-hidden
                      >
                        <div
                          style={{
                            ...skeletonStyle,
                            width: "28px",
                            height: "14px",
                          }}
                        />
                        <span className="text-transparent select-none" style={{ fontSize: "12px" }}>/</span>
                        <div
                          style={{
                            ...skeletonStyle,
                            width: "28px",
                            height: "14px",
                          }}
                        />
                      </div>
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-[34px] w-[80px] rounded" style={skeletonStyle} aria-hidden />
                        <div className="h-[34px] w-[70px] rounded" style={skeletonStyle} aria-hidden />
                      </div>
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-[34px] w-[80px] rounded" style={skeletonStyle} aria-hidden />
                        <div className="h-[34px] w-[70px] rounded" style={skeletonStyle} aria-hidden />
                      </div>
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="h-[34px] w-[140px] rounded mx-auto" style={skeletonStyle} aria-hidden />
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] align-middle text-center">
                      <div className="h-[60px] w-[280px] rounded mx-auto" style={skeletonStyle} aria-hidden />
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="h-6 w-6 rounded mx-auto" style={skeletonStyle} aria-hidden />
                    </td>
                  </tr>
                ))
              ) : (
                rows.map((row, index) => (
                  <tr key={row.date} className="bg-white hover:bg-[#f5f5f5] h-[80px]">
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="text-[18px] font-normal mb-1" style={{ color: "#000000" }}>
                        {getDayName(row.date)}
                      </div>
                      <div className="text-[#555555] text-xs">{formatDateDisplay(row.date).split(" ")[1]}</div>
                    </td>
                    <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <select
                          className={selectClass + " max-w-[80px]"}
                          value={row.startHour}
                          onChange={(e) => setRow(index, (r) => ({ ...r, startHour: e.target.value }))}
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
                          onChange={(e) => setRow(index, (r) => ({ ...r, startMinute: e.target.value }))}
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
                          onChange={(e) => setRow(index, (r) => ({ ...r, endHour: e.target.value }))}
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
                          onChange={(e) => setRow(index, (r) => ({ ...r, endMinute: e.target.value }))}
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
                        onChange={(e) => setRow(index, (r) => ({ ...r, lunch: e.target.value }))}
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
                        onChange={(e) => setRow(index, (r) => ({ ...r, description: e.target.value }))}
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
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div style={{ height: "28px" }} aria-hidden />

        <div className="flex items-center justify-between gap-4 flex-wrap font-roboto">
          <div className="flex items-center gap-3 flex-wrap">
            {currentWeek && prevWeekStr && (
              <button
                type="button"
                onClick={() => changeWeek(prevWeekStr)}
                className={backButtonClass + " no-underline"}
              >
                &laquo;&laquo; Prev Week
              </button>
            )}
          </div>
          {nextWeek && nextWeekStr && (
            <button
              type="button"
              onClick={() => changeWeek(nextWeekStr)}
              className={backButtonClass + " no-underline"}
            >
              Next Week &raquo;&raquo;
            </button>
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
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Home State/Country: </label>
              <input
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={hometownValue}
                onChange={(e) => setHometownValue(e.target.value)}
                aria-label="Home State/Country"
              />
            </div>
            {hometownError && (
              <p className="text-red-600 text-sm font-roboto text-center w-full">{hometownError}</p>
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

      <Modal isOpen={saveModalDisclosure.isOpen} onOpenChange={saveModalDisclosure.onOpenChange} hideCloseButton>
        <ModalContent className="max-w-[380px] w-full">
          <ModalBody className="flex flex-col items-center justify-center gap-4 py-8 font-roboto">
            {saving ? (
              <div className="flex flex-col items-center gap-4" style={{ minHeight: 120 }}>
                <p className="text-[#000000] text-center font-normal" style={{ fontSize: "18px" }}>Saving Timesheet...</p>
                <div
                  aria-hidden
                  style={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    minHeight: 80,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      border: "4px solid #e5e7eb",
                      borderTopColor: "#900",
                      borderRadius: "50%",
                      boxSizing: "border-box",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                </div>
              </div>
            ) : saveError ? (
              <>
                <p className="text-center text-red-600 text-sm">{saveError}</p>
                <button
                  type="button"
                  onClick={saveModalDisclosure.onClose}
                  className={actionButtonClass}
                >
                  Close
                </button>
              </>
            ) : successMessage ? (
              <>
                <p className="text-[#000000] font-bold text-center" style={{ fontSize: "22px" }}>Timesheet saved!</p>
                {savedHours != null && (
                  <p className="text-[#000000] text-center font-normal flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1" style={{ fontSize: "18px" }}>
                    <span>You have logged</span>
                    <span className="font-bold" style={{ fontSize: "42px" }}>{savedHours}</span>
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
              </>
            ) : null}
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
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Name: </label>
              <input
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                aria-label="Mentor Name"
              />
            </div>
            <div className="flex items-center font-roboto justify-center">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Job Title: </label>
              <input
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorTitle}
                onChange={(e) => setMentorTitle(e.target.value)}
                aria-label="Job Title"
              />
            </div>
            <div className="flex items-center font-roboto justify-center">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Phone: </label>
              <input
                type="text"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                placeholder="Ex: (555) 555-5555"
                value={mentorPhone}
                onChange={(e) => setMentorPhone(e.target.value)}
                aria-label="Phone"
              />
            </div>
            <div className="flex items-center font-roboto justify-center">
              <label className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0">Email: </label>
              <input
                type="email"
                className={detailsInputClass + " w-[200px] max-w-[200px]"}
                style={{ marginLeft: 24 }}
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                aria-label="Email"
              />
            </div>
            {mentorError && (
              <p className="text-red-600 text-sm font-roboto text-center w-full">{mentorError}</p>
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
        <div className="w-full bg-white min-h-screen py-8 px-[100px] text-center text-[#555] font-roboto">
          Loading…
        </div>
      }
    >
      <TimePageContent />
    </Suspense>
  );
}
