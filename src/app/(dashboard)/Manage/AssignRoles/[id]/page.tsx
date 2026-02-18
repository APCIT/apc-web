'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  GET_USER_ROLES_API,
  UPDATE_USER_ROLES_API,
  type UpdateUserRolesPayload,
} from "@/lib/api";

const roleLabelClass = "font-inherit text-[#666] text-sm";
const rowStyle = { marginBottom: "24px" };
const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

const EDITABLE_ROLES = [
  { key: "accountant", label: "Accountant" },
  { key: "admin", label: "Admin" },
  { key: "advisor", label: "Advisor" },
  { key: "client", label: "Client" },
  { key: "IT", label: "IT" },
  { key: "reception", label: "Reception" },
  { key: "staff", label: "Staff" },
] as const;

export default function AssignRolesPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roles, setRoles] = useState<Record<string, boolean>>({
    accountant: false,
    admin: false,
    advisor: false,
    client: false,
    IT: false,
    intern: false,
    reception: false,
    staff: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await GET_USER_ROLES_API(id);
      if (cancelled) return;
      setLoading(false);
      if (res.ok) {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setRoles(res.data.roles);
      } else {
        setError(res.error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleRoleChange(key: string, checked: boolean) {
    setRoles((prev) => ({ ...prev, [key]: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSubmitting(true);

    const payload: UpdateUserRolesPayload = {};
    for (const { key } of EDITABLE_ROLES) {
      payload[key] = roles[key] ?? false;
    }

    const res = await UPDATE_USER_ROLES_API(id, payload);
    setSubmitting(false);
    if (res.ok) {
      router.push("/Manage/Users");
      return;
    }
    setError(res.error);
  }

  if (!id) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">Invalid user.</p>
          <Link href="/Manage/Users" className={backButtonClass + " mt-4 inline-block"}>
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const displayName = loading
    ? "Loading Name"
    : [firstName, lastName].filter(Boolean).join(" ") || "User";

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-4">
          <Link
            href="/Manage/Users"
            className={backButtonClass}
            style={{ fontWeight: "normal", textDecoration: "none" }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: "10px" }}>
              &#10094;
            </span>
            Back to Users
          </Link>
        </div>

        <div className="mb-4">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            User Roles - {displayName}
          </h2>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {EDITABLE_ROLES.map(({ key, label }) => (
              <div key={key} className="flex items-center" style={rowStyle}>
                <label
                  className={`${roleLabelClass} flex items-center gap-2 ${loading ? "cursor-not-allowed text-[#999]" : "cursor-pointer no-underline hover:underline"}`}
                >
                  <input
                    type="checkbox"
                    checked={roles[key] ?? false}
                    onChange={(e) => !loading && handleRoleChange(key, e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-[#ccc]"
                  />
                  {label}
                </label>
              </div>
            ))}
            <div className="flex items-center" style={rowStyle}>
              <label className={`${roleLabelClass} flex items-center gap-2 text-[#999]`}>
                <input
                  type="checkbox"
                  checked={roles.intern ?? false}
                  disabled
                  readOnly
                  className="w-4 h-4 rounded border-[#ccc]"
                />
                Intern (display only)
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || loading}
              className={actionButtonClass}
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
