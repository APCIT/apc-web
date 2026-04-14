"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CHANGE_PASSWORD_API, GET_ME_API } from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(true);

  useEffect(() => {
    let cancelled = false;
    GET_ME_API().then((res) => {
      if (cancelled) return;
      if (res.ok && !res.hasPassword) {
        router.replace("/Manage/SetPassword");
        return;
      }
      setCheckingAccount(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkingAccount) return;
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!currentPassword.trim()) {
      setError("Current password is required.");
      return;
    }
    setSubmitting(true);
    const res = await CHANGE_PASSWORD_API({
      currentPassword,
      newPassword,
    });
    setSubmitting(false);
    if (res.ok) {
      router.push("/Manage?message=PasswordChanged");
      return;
    }
    setError(res.error ?? "Failed to change password.");
  }

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-4 text-left">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Change Password
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-sm" style={{ color: "#900" }}>
              {error}
            </div>
          )}

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="currentPassword" className={labelClass}>
              Current password
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="newPassword" className={labelClass}>
              New password
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm new password
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button
                type="submit"
                disabled={submitting || checkingAccount}
                className={actionButtonClass}
              >
                {submitting ? "Changing…" : "Change password"}
              </button>
              <Link
                href="/Manage"
                className={actionButtonClass + " no-underline"}
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            href="/Manage"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span
              className="text-[14px] font-bold"
              style={{ marginRight: "10px" }}
            >
              &#10094;
            </span>
            Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
