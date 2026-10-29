"use client";

import { useState } from "react";

/** Same field width/height as Promote / Hometown modals. */
const inputClass =
  "w-[200px] max-w-[200px] min-h-[40px] h-[40px] px-3 py-2 border border-[#ccc] rounded-[4px] text-[14px] font-roboto font-mono focus:border-[#666] box-border bg-white text-[#000]";

/** Same as Applicant Details / Time modal footer buttons. */
export const tempCredModalButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

type Props = {
  userName: string;
  temporaryPassword: string;
  /** 11px note under the title (same pattern as other modals). */
  hint?: string;
  doneLabel?: string;
  onDone: () => void;
  /** When false, only the field rows (parent should render ModalFooter). Default true. */
  showActions?: boolean;
};

/**
 * One-time username + temporary password, styled like site promote/edit modals.
 */
export default function TempCredentialsNotice({
  userName,
  temporaryPassword,
  hint,
  doneLabel = "Done",
  onDone,
  showActions = true,
}: Props) {
  const [copied, setCopied] = useState<"user" | "pass" | "both" | null>(null);

  const copy = async (which: "user" | "pass" | "both") => {
    const text =
      which === "user"
        ? userName
        : which === "pass"
          ? temporaryPassword
          : `Username: ${userName}\nTemporary password: ${temporaryPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full flex flex-col items-center font-roboto text-[#333]">
      {hint && (
        <p
          className="font-roboto font-normal text-[#000000] text-center w-full mb-4"
          style={{ fontSize: "11px" }}
        >
          {hint}
        </p>
      )}

      <div className="flex items-center font-roboto justify-center mb-4 w-full">
        <label
          htmlFor="temp-cred-username"
          className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0"
        >
          Username:{" "}
        </label>
        <input
          id="temp-cred-username"
          className={inputClass}
          style={{ marginLeft: 24 }}
          value={userName}
          readOnly
          onFocus={(e) => e.target.select()}
        />
      </div>

      <div className="flex items-center font-roboto justify-center mb-2 w-full">
        <label
          htmlFor="temp-cred-password"
          className="w-[140px] text-right text-[14px] text-[#333] font-bold shrink-0"
        >
          Temp password:{" "}
        </label>
        <input
          id="temp-cred-password"
          className={inputClass}
          style={{ marginLeft: 24 }}
          value={temporaryPassword}
          readOnly
          onFocus={(e) => e.target.select()}
        />
      </div>

      {showActions && (
        <div
          className="flex flex-wrap justify-center w-full"
          style={{ gap: 12, paddingTop: 20 }}
        >
          <button
            type="button"
            className={tempCredModalButtonClass}
            onClick={() => copy("user")}
          >
            {copied === "user" ? "Copied" : "Copy username"}
          </button>
          <button
            type="button"
            className={tempCredModalButtonClass}
            onClick={() => copy("pass")}
          >
            {copied === "pass" ? "Copied" : "Copy password"}
          </button>
          <button
            type="button"
            className={tempCredModalButtonClass}
            onClick={() => copy("both")}
          >
            {copied === "both" ? "Copied both" : "Copy both"}
          </button>
          <button type="button" className={tempCredModalButtonClass} onClick={onDone}>
            {doneLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/** Footer actions for HeroUI ModalFooter (same buttons as Time / Promote modals). */
export function TempCredentialsFooter({
  userName,
  temporaryPassword,
  doneLabel = "Done",
  onDone,
}: {
  userName: string;
  temporaryPassword: string;
  doneLabel?: string;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState<"user" | "pass" | "both" | null>(null);

  const copy = async (which: "user" | "pass" | "both") => {
    const text =
      which === "user"
        ? userName
        : which === "pass"
          ? temporaryPassword
          : `Username: ${userName}\nTemporary password: ${temporaryPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        type="button"
        className={tempCredModalButtonClass}
        onClick={() => copy("both")}
      >
        {copied === "both" ? "Copied both" : "Copy both"}
      </button>
      <button type="button" className={tempCredModalButtonClass} onClick={onDone}>
        {doneLabel}
      </button>
    </>
  );
}
