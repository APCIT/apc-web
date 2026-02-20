'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GET_SERVICE_BY_ID_API, DELETE_SERVICE_API, type ServiceDetailItem } from "@/lib/api";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonthYear(iso: string): string {
  try {
    const d = new Date(iso);
    const month = MONTH_SHORT[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${month}-${year}`;
  } catch {
    return iso;
  }
}

const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:bg-[#e6e6e6] hover:border-[#adadad] text-[#333]";

const skeletonStyle = {
  display: "inline-block" as const,
  height: "16px",
  minWidth: "80px",
  maxWidth: "200px",
  backgroundColor: "#e5e5e5",
  borderRadius: "4px",
};

function DetailRow({ label, value, skeleton }: { label: string; value: React.ReactNode; skeleton?: boolean }) {
  return (
    <div className="flex font-roboto text-[14px] text-[#333]" style={{ marginBottom: "16px" }}>
      <span className="font-bold w-[180px] shrink-0">{label}</span>
      {skeleton ? (
        <span style={skeletonStyle} />
      ) : (
        <span className="text-[#666]">{value}</span>
      )}
    </div>
  );
}

export default function ServiceDeletePage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "";
  const id = parseInt(idParam, 10);

  const [service, setService] = useState<ServiceDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setLoading(false);
      setError("Invalid service id");
      return;
    }
    let cancelled = false;
    GET_SERVICE_BY_ID_API(id)
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setService(res.service);
        else {
          setError(res.status === 404 ? "Service not found" : res.error);
          if (res.status === 404) setService(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load service");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!Number.isInteger(id) || id <= 0) return;
    setDeleteError(null);
    setDeleting(true);
    const res = await DELETE_SERVICE_API(id);
    setDeleting(false);
    if (res.ok) {
      router.push("/Services");
      return;
    }
    setDeleteError(res.error);
  };

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">Invalid service.</p>
          <Link href="/Services" className={actionButtonClass + " mt-4 inline-block"}>
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">{error}</p>
          <Link href="/Services" className={actionButtonClass + " mt-4 inline-block"}>
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  const s = service;
  const showSkeleton = loading;

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: "20px" }} />

        <div className="mb-4">
          <h2 className="font-roboto" style={{ fontSize: "30px", fontWeight: "normal", color: "#000000" }}>
            Delete
          </h2>
          <p className="font-roboto mt-2" style={{ fontSize: "24px", color: "#900" }}>
            Are you sure you want to delete this service record?
          </p>
        </div>

        <hr className="border-t border-[#ccc] mb-6" />

        <div className="max-w-2xl">
          <DetailRow
            label="Type of Service:"
            value={s ? s.typeOfService || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Name:"
            value={s ? s.companyName || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Staff Member:"
            value={s ? s.staffMember || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Start Date:"
            value={s ? formatMonthYear(s.startDate) : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="End Date:"
            value={s ? formatMonthYear(s.endDate) : "\u2014"}
            skeleton={showSkeleton}
          />
        </div>

        {deleteError && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm font-roboto">
            {deleteError}
          </div>
        )}

        <div className="flex items-center gap-3 mt-8">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || loading}
            className={actionButtonClass}
            style={{ marginRight: "12px" }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
          <Link href="/Services" className={actionButtonClass} style={{ textDecoration: "none" }}>
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
