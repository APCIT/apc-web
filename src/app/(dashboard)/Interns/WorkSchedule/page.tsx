"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import {
  GET_WORK_SCHEDULE_PAGE_API,
  POST_WORK_SCHEDULE_UPDATE_API,
  type WorkScheduleDayItem,
  type WorkSchedulePageResponse,
  type WorkScheduleUpdateRow,
} from "@/lib/api";

const selectClass =
  "px-1.5 py-1 min-h-[32px] border border-[#999] rounded text-[13px] font-roboto text-[#333] bg-white focus:outline-none focus:border-[#666]";
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

const skeletonStyle = {
  backgroundColor: "rgb(209 213 219)",
  borderRadius: "4px",
  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

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

type RowState = WorkScheduleDayItem;

function buildRowState(d: WorkScheduleDayItem): RowState {
  return { ...d };
}

export default function WorkSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<WorkSchedulePageResponse | null>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const saveModalDisclosure = useDisclosure();

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await GET_WORK_SCHEDULE_PAGE_API();
    setLoading(false);
    if (!res.ok) {
      setLoadError(res.error ?? "Failed to load");
      if (res.status === 403 || res.status === 401) {
        router.replace("/");
      }
      return;
    }
    setData(res.data);
    setRows(res.data.days.map(buildRowState));
  }, [router]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const setRow = useCallback((index: number, updater: (prev: RowState) => RowState) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = updater(prev[index]);
      return next;
    });
  }, []);

  const addSecondBlock = useCallback(
    (index: number) => {
      setRow(index, (r) => ({ ...r, hasSecondBlock: true }));
    },
    [setRow]
  );

  const removeSecondBlock = useCallback(
    (index: number) => {
      setRow(index, (r) => ({
        ...r,
        hasSecondBlock: false,
        startHour2: "",
        startMinute2: "",
        endHour2: "",
        endMinute2: "",
      }));
    },
    [setRow]
  );

  const handleSave = async () => {
    setSaveError(null);
    setSuccessMessage(false);
    setSaving(true);
    saveModalDisclosure.onOpen();

    const week: WorkScheduleUpdateRow[] = rows.map((r) => ({
      Id: r.id || undefined,
      Day: r.day,
      StartHour1: r.startHour1 || null,
      StartMinute1: r.startMinute1 || null,
      EndHour1: r.endHour1 || null,
      EndMinute1: r.endMinute1 || null,
      StartHour2: r.hasSecondBlock ? (r.startHour2 || null) : null,
      StartMinute2: r.hasSecondBlock ? (r.startMinute2 || null) : null,
      EndHour2: r.hasSecondBlock ? (r.endHour2 || null) : null,
      EndMinute2: r.hasSecondBlock ? (r.endMinute2 || null) : null,
    }));
    const res = await POST_WORK_SCHEDULE_UPDATE_API(week);
    setSaving(false);
    if (!res.ok) {
      setSaveError(res.error ?? "Failed to save");
      return;
    }
    setSuccessMessage(true);
    setSaveError(null);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="py-8 px-[100px]">
        <div className="text-center" style={{ marginBottom: "4px" }}>
          <h2
            className="font-roboto mx-auto leading-none"
            style={{ fontSize: "30px", fontWeight: "normal", color: "#000000", marginBottom: "6px" }}
          >
            Semester Work Schedule
          </h2>
          {loadError && !data && (
            <>
              <p className="text-red-600 font-roboto text-sm" style={{ marginTop: "2px" }}>
                {loadError}
              </p>
              <div style={{ marginTop: "2px" }} className="text-center">
                <Link href="/" className={backButtonClass}>
                  Go to Home
                </Link>
              </div>
            </>
          )}
        </div>

        {data && (
          <div className="flex items-center justify-start mb-3 font-roboto">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className={actionButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}

        <div style={{ height: "28px" }} aria-hidden />

        <div className="mb-5">
          <div className="overflow-x-auto">
            <table className="w-full max-w-full border-collapse font-roboto text-sm">
              <thead>
                <tr className="bg-[#9E1B32]">
                  <th className="border border-[#7a0000] py-[10px] px-[5px] text-white font-normal text-center">
                    Day
                  </th>
                  <th className="border border-[#7a0000] py-[10px] px-[5px] text-white font-normal text-center">
                    Start Time
                  </th>
                  <th className="border border-[#7a0000] py-[10px] px-[5px] text-white font-normal text-center">
                    End Time
                  </th>
                  <th className="border border-[#7a0000] py-[10px] px-[5px] text-white font-normal text-center">
                    Add
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }, (_, i) => (
                    <tr key={`skeleton-${i}`} className="bg-white h-[100px]">
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle">
                        <div className="text-[18px] font-normal" style={{ color: "#000000" }}>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i]}
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-[40px] w-[80px] rounded" style={skeletonStyle} aria-hidden />
                          <div className="h-[40px] w-[70px] rounded" style={skeletonStyle} aria-hidden />
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-[40px] w-[80px] rounded" style={skeletonStyle} aria-hidden />
                          <div className="h-[40px] w-[70px] rounded" style={skeletonStyle} aria-hidden />
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle">
                        <div className="h-8 w-8 rounded mx-auto" style={skeletonStyle} aria-hidden />
                      </td>
                    </tr>
                  ))
                ) : (
                  rows.map((row, index) => (
                    <tr key={row.day} className="bg-white hover:bg-[#f5f5f5]">
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle" style={{ verticalAlign: "middle" }}>
                        <div className="text-[18px] font-normal" style={{ color: "#000000" }}>
                          {row.dayName}
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-top">
                        <div className="flex flex-col items-center gap-5">
                          <div className="flex items-center justify-center gap-1">
                            <select
                              className={selectClass + " max-w-[72px]"}
                              value={row.startHour1}
                              onChange={(e) => setRow(index, (r) => ({ ...r, startHour1: e.target.value }))}
                              aria-label={`${row.dayName} start hour`}
                            >
                              {START_HOUR_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                              ))}
                            </select>
                            <span style={{ color: "#000000" }}>:</span>
                            <select
                              className={selectClass + " max-w-[60px]"}
                              value={row.startMinute1}
                              onChange={(e) => setRow(index, (r) => ({ ...r, startMinute1: e.target.value }))}
                              aria-label={`${row.dayName} start minute`}
                            >
                              {MINUTE_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                              ))}
                            </select>
                          </div>
                          {row.hasSecondBlock && (
                            <div className="flex items-center justify-center gap-1 pt-4 mt-1 border-t border-[#eee]">
                              <select
                                className={selectClass + " max-w-[72px]"}
                                value={row.startHour2}
                                onChange={(e) => setRow(index, (r) => ({ ...r, startHour2: e.target.value }))}
                                aria-label={`${row.dayName} block 2 start hour`}
                              >
                                {START_HOUR_OPTIONS.map((o) => (
                                  <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                                ))}
                              </select>
                              <span style={{ color: "#000000" }}>:</span>
                              <select
                                className={selectClass + " max-w-[60px]"}
                                value={row.startMinute2}
                                onChange={(e) => setRow(index, (r) => ({ ...r, startMinute2: e.target.value }))}
                                aria-label={`${row.dayName} block 2 start minute`}
                              >
                                {MINUTE_OPTIONS.map((o) => (
                                  <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-top">
                        <div className="flex flex-col items-center gap-5">
                          <div className="flex items-center justify-center gap-1">
                            <select
                              className={selectClass + " max-w-[72px]"}
                              value={row.endHour1}
                              onChange={(e) => setRow(index, (r) => ({ ...r, endHour1: e.target.value }))}
                              aria-label={`${row.dayName} end hour`}
                            >
                              {END_HOUR_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                              ))}
                            </select>
                            <span style={{ color: "#000000" }}>:</span>
                            <select
                              className={selectClass + " max-w-[60px]"}
                              value={row.endMinute1}
                              onChange={(e) => setRow(index, (r) => ({ ...r, endMinute1: e.target.value }))}
                              aria-label={`${row.dayName} end minute`}
                            >
                              {MINUTE_OPTIONS.map((o) => (
                                <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                              ))}
                            </select>
                          </div>
                          {row.hasSecondBlock && (
                            <div className="flex items-center justify-center gap-1 pt-4 mt-1 border-t border-[#eee]">
                              <select
                                className={selectClass + " max-w-[72px]"}
                                value={row.endHour2}
                                onChange={(e) => setRow(index, (r) => ({ ...r, endHour2: e.target.value }))}
                                aria-label={`${row.dayName} block 2 end hour`}
                              >
                                {END_HOUR_OPTIONS.map((o) => (
                                  <option key={o.value || "blank"} value={o.value}>{o.label || "Hour"}</option>
                                ))}
                              </select>
                              <span style={{ color: "#000000" }}>:</span>
                              <select
                                className={selectClass + " max-w-[60px]"}
                                value={row.endMinute2}
                                onChange={(e) => setRow(index, (r) => ({ ...r, endMinute2: e.target.value }))}
                                aria-label={`${row.dayName} block 2 end minute`}
                              >
                                {MINUTE_OPTIONS.map((o) => (
                                  <option key={o.value || "blank"} value={o.value}>{o.label || "Min"}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-[#ddd] py-[20px] px-[10px] text-center align-middle" style={{ verticalAlign: "middle" }}>
                        {row.hasSecondBlock ? (
                          <button
                            type="button"
                            className="px-[10px] py-[5px] text-[16px] leading-[1.5] rounded-[3px] text-[#333] bg-white border border-[#ccc] hover:bg-[#e6e6e6]"
                            onClick={() => removeSecondBlock(index)}
                            aria-label={`Remove second block ${row.dayName}`}
                          >
                            −
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="px-[10px] py-[5px] text-[16px] leading-[1.5] rounded-[3px] text-[#333] bg-white border border-[#ccc] hover:bg-[#e6e6e6]"
                            onClick={() => addSecondBlock(index)}
                            aria-label={`Add second block ${row.dayName}`}
                          >
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={saveModalDisclosure.isOpen} onOpenChange={saveModalDisclosure.onOpenChange} hideCloseButton>
        <ModalContent className="max-w-[380px] w-full">
          <ModalBody className="flex flex-col items-center justify-center gap-4 py-8 font-roboto">
            {saving ? (
              <div className="flex flex-col items-center gap-4" style={{ minHeight: 120 }}>
                <p className="text-[#000000] text-center font-normal" style={{ fontSize: "18px" }}>
                  Saving…
                </p>
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
                <button type="button" onClick={saveModalDisclosure.onClose} className={actionButtonClass}>
                  Close
                </button>
              </>
            ) : successMessage ? (
              <>
                <p className="text-[#000000] font-bold text-center" style={{ fontSize: "22px" }}>
                  Work Schedule saved!
                </p>
                <button type="button" onClick={saveModalDisclosure.onClose} className={actionButtonClass}>
                  Close
                </button>
              </>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
