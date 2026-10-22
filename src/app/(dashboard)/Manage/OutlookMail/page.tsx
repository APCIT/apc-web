"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

type Status = {
  configured: boolean;
  connected: boolean;
  accountEmail: string | null;
  senderEmail: string;
};

export default function OutlookMailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/manage/outlook-oauth/status")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to load status");
        setStatus(data as Status);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load status"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const err = searchParams.get("error");
    const email = searchParams.get("email");
    if (connected) {
      setInfo(
        email
          ? `Connected as ${email}. Outbound mail will send from this Outlook account.`
          : "Outlook connected. Outbound mail will send from this account."
      );
    }
    if (err) setError(err);
    load();
  }, [load, searchParams]);

  const disconnect = async () => {
    setDisconnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/manage/outlook-oauth/disconnect", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to disconnect");
      setInfo("Outlook disconnected. Resend will be used if configured.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to disconnect");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-[60vh]">
      <div className="py-8 px-[50px] max-w-3xl">
        <Link href="/Manage" className={backButtonClass}>
          &lt; Back to Account
        </Link>

        <h2
          className="mt-6 mb-4 text-[30px] font-roboto text-left"
          style={{ fontWeight: "normal", color: "#000000" }}
        >
          Outlook Mail
        </h2>

        <p className="font-roboto text-[14px] text-[#666] mb-6 leading-relaxed">
          Connect <strong>apc-ua@outlook.com</strong> once with Microsoft sign-in. After that, help
          requests and payday client emails can send from that inbox to any recipient (no custom
          domain required).
        </p>

        {info && (
          <p className="mb-4 font-roboto text-sm" style={{ color: "#3c763d" }}>
            {info}
          </p>
        )}
        {error && (
          <p className="mb-4 font-roboto text-sm" style={{ color: "#a94442" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-roboto text-sm text-[#666]">Loading…</p>
        ) : (
          <div className="border border-[#ddd] rounded-[8px] p-5 mb-6">
            <p className="font-roboto text-[14px] text-[#333] mb-2">
              <span className="font-bold">App configured:</span>{" "}
              {status?.configured ? "Yes" : "No — set MS_GRAPH_CLIENT_ID and MS_GRAPH_CLIENT_SECRET"}
            </p>
            <p className="font-roboto text-[14px] text-[#333] mb-2">
              <span className="font-bold">Connected:</span>{" "}
              {status?.connected ? "Yes" : "No"}
            </p>
            <p className="font-roboto text-[14px] text-[#333] mb-2">
              <span className="font-bold">Account:</span>{" "}
              {status?.accountEmail || "—"}
            </p>
            <p className="font-roboto text-[14px] text-[#333]">
              <span className="font-bold">Send as:</span> {status?.senderEmail || "—"}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-10">
          <a href="/api/manage/outlook-oauth/start" className={actionButtonClass}>
            {status?.connected ? "Reconnect Outlook" : "Connect Outlook"}
          </a>
          {status?.connected && (
            <button
              type="button"
              className={actionButtonClass}
              onClick={disconnect}
              disabled={disconnecting}
            >
              {disconnecting ? "Disconnecting…" : "Disconnect"}
            </button>
          )}
        </div>

        <h3 className="font-roboto text-[18px] text-[#333] mb-3">Azure setup (one time)</h3>
        <ol className="font-roboto text-[14px] text-[#666] list-decimal pl-5 space-y-2 leading-relaxed">
          <li>
            Open app registration <strong>APC Web Mail</strong> in Azure Portal.
          </li>
          <li>
            <strong>Authentication</strong> → add a Web redirect URI:{" "}
            <code className="text-[13px]">http://localhost:3000/api/manage/outlook-oauth/callback</code>
            {" "}(and your production URL later).
          </li>
          <li>
            <strong>Supported account types</strong> → change to include{" "}
            <em>personal Microsoft accounts</em> (not org-only). Save.
          </li>
          <li>
            <strong>API permissions</strong> → Microsoft Graph → <em>Delegated</em> →{" "}
            <code className="text-[13px]">Mail.Send</code> and <code className="text-[13px]">User.Read</code>{" "}
            (you can remove Application <code className="text-[13px]">Mail.Send</code> if you want).
          </li>
          <li>
            Put <code className="text-[13px]">MS_GRAPH_CLIENT_ID</code> and{" "}
            <code className="text-[13px]">MS_GRAPH_CLIENT_SECRET</code> in <code className="text-[13px]">.env</code>,
            restart the server, then click <strong>Connect Outlook</strong> and sign in as{" "}
            <strong>apc-ua@outlook.com</strong>.
          </li>
        </ol>
      </div>
    </div>
  );
}
