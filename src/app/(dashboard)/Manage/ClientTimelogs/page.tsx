"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline";
const actionButtonClass =
  "inline-flex items-center justify-center gap-2 px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50";
/** Same as Time page Hometown / Mentor Info buttons. */
const tableActionButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";
const inputClass =
  "px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:border-[#666] h-[36px]";
const thClass =
  "border border-[#7a0000] p-[10px] text-white font-normal text-left";
const tdClass = "border border-[#ddd] p-[10px] text-[#666]";

type InternOpt = { id: string; firstName: string; lastName: string };

type ClientRow = {
  id: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  companyId: number;
  companyName: string | null;
  active: boolean;
  selectedInternIds: string[] | null;
  interns: InternOpt[];
};

type LogRow = {
  id: string;
  recipientEmail: string;
  clientName: string | null;
  companyName: string | null;
  periodLabel: string;
  internCount: number;
  rowCount: number;
  status: string;
  errorMessage: string | null;
  sentAt: string;
};

type Payload = {
  period: { label: string; start: string; end: string };
  config: {
    semesterLabel: string | null;
    semesterEnd: string | null;
    semesterEnded: boolean;
  };
  clients: ClientRow[];
  logs: LogRow[];
};

function displayName(c: ClientRow): string {
  const n = [c.lastName, c.firstName].filter(Boolean).join(", ");
  return n || c.userName;
}

/** null = all company interns (same as API). */
function selectionCount(c: ClientRow, draft: string[] | null | undefined): number {
  if (draft === undefined) {
    return c.selectedInternIds == null ? c.interns.length : c.selectedInternIds.length;
  }
  return draft == null ? c.interns.length : draft.length;
}

export default function ClientTimelogsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  /** Draft intern selection for the expanded client; null = all. */
  const [draftInternIds, setDraftInternIds] = useState<string[] | null>(null);
  const [draftDirty, setDraftDirty] = useState(false);
  const [semesterLabel, setSemesterLabel] = useState("");
  const [semesterEnd, setSemesterEnd] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manage/client-timelogs");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to load");
      const payload = json as Payload;
      setData(payload);
      setSemesterLabel(payload.config.semesterLabel ?? "");
      setSemesterEnd(payload.config.semesterEnd ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patchClient = async (
    id: string,
    body: { active?: boolean; selectedInternIds?: string[] | null }
  ) => {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/manage/client-timelogs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to save");
      await load(true);
      setInfo("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const saveConfig = async () => {
    setSavingConfig(true);
    setError(null);
    try {
      const res = await fetch("/api/manage/client-timelogs/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semesterLabel: semesterLabel.trim() || null,
          semesterEnd: semesterEnd || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to save semester");
      setInfo("Semester settings saved.");
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save semester");
    } finally {
      setSavingConfig(false);
    }
  };

  const sendOne = async (clientUserId: string) => {
    setSendingId(clientUserId);
    setError(null);
    setInfo(null);
    try {
      let forceAfterSemester = false;
      if (data?.config.semesterEnded) {
        forceAfterSemester = confirm(
          "Semester end date has passed. Send this client anyway?"
        );
        if (!forceAfterSemester) {
          setSendingId(null);
          return;
        }
      }
      const res = await fetch("/api/manage/client-timelogs/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientUserId, forceAfterSemester }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Send failed");
      const r = json.results?.[0];
      if (r?.ok) {
        setInfo(`Sent to ${r.recipientEmail} (${r.rowCount} row(s)).`);
      } else {
        setError(r?.error || "Send failed");
      }
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSendingId(null);
    }
  };

  const sendAll = async () => {
    if (data?.config.semesterEnded) {
      setError("Semester ended — update the semester end date before bulk send.");
      return;
    }
    if (!confirm("Send previous pay-period timelogs to all active clients?")) return;
    setSendingAll(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/manage/client-timelogs/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Send failed");
      setInfo(`Done: ${json.sent} sent, ${json.failed} failed.`);
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSendingAll(false);
    }
  };

  const openInternPicker = (c: ClientRow) => {
    if (expandedId === c.id) {
      if (draftDirty && !confirm("Discard unsaved intern changes?")) return;
      setExpandedId(null);
      setDraftDirty(false);
      return;
    }
    if (expandedId && draftDirty && !confirm("Discard unsaved intern changes?")) return;
    setExpandedId(c.id);
    setDraftInternIds(c.selectedInternIds == null ? null : [...c.selectedInternIds]);
    setDraftDirty(false);
  };

  const toggleInternDraft = (c: ClientRow, internId: string) => {
    setDraftDirty(true);
    setDraftInternIds((prev) => {
      const current = prev == null ? c.interns.map((i) => i.id) : [...prev];
      if (current.includes(internId)) {
        return current.filter((id) => id !== internId);
      }
      return [...current, internId];
    });
  };

  const selectAllInternsDraft = () => {
    setDraftDirty(true);
    setDraftInternIds(null);
  };

  const clearAllInternsDraft = () => {
    setDraftDirty(true);
    setDraftInternIds([]);
  };

  const saveInternDraft = async (c: ClientRow) => {
    let toSave = draftInternIds;
    if (
      toSave != null &&
      toSave.length === c.interns.length &&
      c.interns.every((i) => toSave!.includes(i.id))
    ) {
      toSave = null;
    }
    await patchClient(c.id, { selectedInternIds: toSave });
    setDraftDirty(false);
    setDraftInternIds(toSave);
  };

  const cancelInternDraft = (c: ClientRow) => {
    setDraftInternIds(c.selectedInternIds == null ? null : [...c.selectedInternIds]);
    setDraftDirty(false);
  };

  const isDraftChecked = (c: ClientRow, internId: string): boolean => {
    if (expandedId !== c.id) {
      return c.selectedInternIds == null || c.selectedInternIds.includes(internId);
    }
    if (draftInternIds == null) return true;
    return draftInternIds.includes(internId);
  };

  const semesterEnded = data?.config.semesterEnded ?? false;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-6">
          <Link
            href="/Manage"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>
              &#10094;
            </span>
            Back to Account
          </Link>
        </div>

        <div className="mb-4 text-left">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Client Timelogs
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <p className="font-roboto text-[14px] text-[#666] mb-4 max-w-3xl">
          Email each client a privacy-safe timesheet (no CWID) for the previous 2-week pay
          period. Add clients under Manage → Users (role Client). Outlook Mail must be connected
          to send.
        </p>

        <p className="font-roboto text-[14px] text-[#333] mb-4">
          <span className="font-bold">Previous pay period:</span>{" "}
          {data?.period.label ?? (loading ? "…" : "—")}
        </p>

        {/* Semester settings — same form row style as other Manage pages */}
        <div className="max-w-3xl border border-[#ddd] p-4 bg-[#f9f9f9]" style={{ marginBottom: "8px" }}>
          <p className="font-roboto text-[14px] text-[#333] font-bold mb-3">
            Semester window
            {semesterEnded ? (
              <span className="ml-2 font-normal" style={{ color: "#a94442" }}>
                (ended — bulk send paused)
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap items-end gap-4 mb-2">
            <div>
              <label
                htmlFor="semester-label"
                className="block font-roboto text-[13px] text-[#666] mb-1"
              >
                Label
              </label>
              <input
                id="semester-label"
                type="text"
                value={semesterLabel}
                onChange={(e) => setSemesterLabel(e.target.value)}
                placeholder="Fall 2026"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="semester-end"
                className="block font-roboto text-[13px] text-[#666] mb-1"
              >
                End date
              </label>
              <input
                id="semester-end"
                type="date"
                value={semesterEnd}
                onChange={(e) => setSemesterEnd(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              className={actionButtonClass}
              onClick={saveConfig}
              disabled={savingConfig}
            >
              {savingConfig ? "Saving…" : "Save"}
            </button>
          </div>
          <p className="font-roboto text-[12px] text-[#666]">
            After this date, “Send all” stops. Next semester: set a new end date (keep clients).
          </p>
        </div>

        {info && (
          <p className="mb-3 font-roboto text-sm" style={{ color: "#3c763d" }}>
            {info}
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded bg-red-50 text-sm"
            style={{ color: "#900" }}
          >
            {error}
          </div>
        )}

        <div className="flex flex-wrap mb-6" style={{ marginTop: "28px", gap: "16px" }}>
          <button
            type="button"
            className={actionButtonClass}
            onClick={sendAll}
            disabled={sendingAll || loading || semesterEnded}
          >
            {sendingAll ? "Sending…" : "Send all active clients"}
          </button>
          <button
            type="button"
            className={actionButtonClass}
            onClick={() => load()}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <h3
          className="font-roboto text-[18px] mb-3"
          style={{ fontWeight: "normal", color: "#000" }}
        >
          Clients
        </h3>

        <div className="overflow-x-auto mb-10" style={{ marginBottom: "48px" }}>
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className={thClass}>Client</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Company</th>
                <th className={thClass}>Active</th>
                <th className={thClass}>Interns</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !data && (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td colSpan={6} className={`${tdClass} text-center`}>
                    Loading…
                  </td>
                </tr>
              )}
              {(data?.clients ?? []).map((c) => {
                const expanded = expandedId === c.id;
                const selectedCount = selectionCount(
                  c,
                  expanded ? draftInternIds : undefined
                );
                return (
                  <Fragment key={c.id}>
                    <tr className="bg-white hover:bg-[#f5f5f5]">
                      <td className={tdClass}>{displayName(c)}</td>
                      <td className={tdClass}>{c.email || "—"}</td>
                      <td className={tdClass}>{c.companyName || "—"}</td>
                      <td className={tdClass}>
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={c.active}
                            disabled={savingId === c.id}
                            onChange={(e) =>
                              patchClient(c.id, { active: e.target.checked })
                            }
                          />
                          {c.active ? "Yes" : "No"}
                        </label>
                      </td>
                      <td className={tdClass}>
                        <span style={{ marginRight: "14px" }}>
                          {selectedCount}/{c.interns.length}
                          {expanded && draftDirty ? " *" : ""}
                        </span>
                        <button
                          type="button"
                          className={tableActionButtonClass}
                          onClick={() => openInternPicker(c)}
                        >
                          {expanded ? "Hide" : "Choose"}
                        </button>
                      </td>
                      <td className={tdClass}>
                        <button
                          type="button"
                          className={tableActionButtonClass}
                          disabled={sendingId === c.id || !c.email}
                          onClick={() => sendOne(c.id)}
                        >
                          {sendingId === c.id ? "Sending…" : "Send now"}
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-[#fafafa]" aria-hidden={!expanded}>
                      <td
                        colSpan={6}
                        className={`p-0 align-top ${
                          expanded ? "border border-[#ddd]" : "border-0"
                        }`}
                      >
                        <div
                          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                        >
                          <div className="overflow-hidden min-h-0">
                            <div
                              className={`px-[10px] py-[10px] transition-opacity duration-300 ease-in-out ${
                                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                              }`}
                            >
                              <div
                                className="mb-2 flex flex-wrap items-center"
                                style={{ gap: "16px" }}
                              >
                                <span className="font-bold text-[#333]">
                                  Interns for this client
                                  {draftDirty ? (
                                    <span className="font-normal text-[#666]">
                                      {" "}
                                      (unsaved)
                                    </span>
                                  ) : null}
                                </span>
                                <button
                                  type="button"
                                  className={tableActionButtonClass}
                                  onClick={selectAllInternsDraft}
                                  disabled={savingId === c.id}
                                  tabIndex={expanded ? 0 : -1}
                                >
                                  Select all (company)
                                </button>
                                <button
                                  type="button"
                                  className={tableActionButtonClass}
                                  onClick={clearAllInternsDraft}
                                  disabled={savingId === c.id}
                                  tabIndex={expanded ? 0 : -1}
                                >
                                  Clear all
                                </button>
                                <button
                                  type="button"
                                  className={tableActionButtonClass}
                                  onClick={() => saveInternDraft(c)}
                                  disabled={savingId === c.id || !draftDirty}
                                  tabIndex={expanded ? 0 : -1}
                                >
                                  {savingId === c.id ? "Saving…" : "Save"}
                                </button>
                                <button
                                  type="button"
                                  className={actionButtonClass}
                                  onClick={() => cancelInternDraft(c)}
                                  disabled={savingId === c.id || !draftDirty}
                                  tabIndex={expanded ? 0 : -1}
                                >
                                  Cancel
                                </button>
                              </div>
                              {c.interns.length === 0 ? (
                                <p className="text-[#666] m-0">
                                  No interns at this company. Assign interns to{" "}
                                  {c.companyName || "the company"} first.
                                </p>
                              ) : (
                                <ul className="m-0 pl-0 list-none flex flex-col gap-1">
                                  {c.interns.map((i) => (
                                    <li key={i.id}>
                                      <label className="inline-flex items-center gap-2 text-[#333] cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={isDraftChecked(c, i.id)}
                                          disabled={savingId === c.id || !expanded}
                                          onChange={() => toggleInternDraft(c, i.id)}
                                          tabIndex={expanded ? 0 : -1}
                                        />
                                        {i.lastName}, {i.firstName}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
              {!loading && (data?.clients ?? []).length === 0 && (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td colSpan={6} className={`${tdClass} text-center`}>
                    No client users yet. Create one under Manage → Users with role Client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3
          className="font-roboto text-[18px] mb-3"
          style={{ fontWeight: "normal", color: "#000" }}
        >
          Send history
        </h3>

        <div className="overflow-x-auto" style={{ marginBottom: "48px" }}>
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className={thClass}>When</th>
                <th className={thClass}>To</th>
                <th className={thClass}>Client</th>
                <th className={thClass}>Period</th>
                <th className={thClass}>Rows</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.logs ?? []).map((l) => (
                <tr key={l.id} className="bg-white hover:bg-[#f5f5f5]">
                  <td className={tdClass}>{new Date(l.sentAt).toLocaleString()}</td>
                  <td className={tdClass}>{l.recipientEmail}</td>
                  <td className={tdClass}>
                    {l.clientName || "—"}
                    {l.companyName ? ` (${l.companyName})` : ""}
                  </td>
                  <td className={tdClass}>{l.periodLabel}</td>
                  <td className={tdClass}>{l.rowCount}</td>
                  <td className={tdClass}>
                    {l.status === "sent" ? (
                      <span style={{ color: "#3c763d" }}>sent</span>
                    ) : (
                      <span style={{ color: "#a94442" }} title={l.errorMessage ?? ""}>
                        failed{l.errorMessage ? `: ${l.errorMessage}` : ""}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {(data?.logs ?? []).length === 0 && (
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td colSpan={6} className={`${tdClass} text-center`}>
                    No sends yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
