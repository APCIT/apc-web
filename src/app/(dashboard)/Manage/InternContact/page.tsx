"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SUBMIT_INTERN_CONTACT_API } from "@/lib/api";

const inputClass =
  "w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] h-[40px]";
const textareaClass =
  "w-full max-w-[400px] min-w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto focus:outline-none focus:border-[#666] min-h-[120px] resize-y";
const labelClass =
  "w-[180px] text-right font-roboto text-[14px] text-[#333] font-bold pr-5";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

const THANKYOU_MESSAGE = "Thanks for sending us a message! We'll be back in touch soon.";

export default function InternContactPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n) {
      setError("Name is required.");
      return;
    }
    if (!em) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(em)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!msg) {
      setError("Message is required.");
      return;
    }

    setSubmitting(true);
    const res = await SUBMIT_INTERN_CONTACT_API({ name: n, email: em, message: msg });
    setSubmitting(false);

    if (res.ok) {
      const params = new URLSearchParams({
        message: THANKYOU_MESSAGE,
        name: n,
      });
      router.push(`/Manage/Thankyou?${params.toString()}`);
      return;
    }
    setError(res.error ?? "Something went wrong. Please try again.");
  };

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-6">
          <Link href="/Manage" className={backButtonClass} style={{ fontWeight: "normal", textDecoration: "none" }}>
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>&#10094;</span>
            Back to Account
          </Link>
        </div>

        <div className="mb-4 text-left">
          <h2 className="text-[24px] font-roboto" style={{ fontWeight: "normal", color: "#000000" }}>
            Help Request Form
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-sm" style={{ color: "#900" }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="intern-contact-name" className={labelClass}>
              Name
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="intern-contact-name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                disabled={submitting}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center" style={rowStyle}>
            <label htmlFor="intern-contact-email" className={labelClass}>
              Email
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <input
                id="intern-contact-email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                disabled={submitting}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex items-start" style={rowStyle}>
            <label htmlFor="intern-contact-message" className={labelClass} style={{ paddingTop: "10px" }}>
              Message
            </label>
            <div className="flex-1" style={{ marginLeft: "20px" }}>
              <textarea
                id="intern-contact-message"
                placeholder="Please Explain the issue you are having and how we can help."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={textareaClass}
                rows={5}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Send / Cancel */}
          <div className="flex items-center mt-6">
            <div className="w-[180px]" />
            <div className="flex-1 flex gap-3" style={{ marginLeft: "20px" }}>
              <button type="submit" disabled={submitting} className={actionButtonClass}>
                {submitting ? "Sending…" : "Send"}
              </button>
              <Link href="/Manage" className={actionButtonClass + " no-underline"}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
