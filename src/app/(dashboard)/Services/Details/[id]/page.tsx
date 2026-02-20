'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GET_SERVICE_BY_ID_API, type ServiceDetailItem } from "@/lib/api";

const backButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";
const actionButtonClass =
  "inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none";

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

function DetailRow({ label, value, skeleton }: { label: string; value: React.ReactNode; skeleton?: boolean }) {
  return (
    <div className="flex font-roboto text-[14px] text-[#333]" style={{ marginBottom: "16px" }}>
      <span className="font-bold w-[180px] shrink-0">{label}</span>
      {skeleton ? (
        <span className="inline-block h-4 min-w-[80px] max-w-[200px] bg-[#e5e5e5] rounded animate-pulse" />
      ) : (
        <span className="text-[#666]">{value}</span>
      )}
    </div>
  );
}

function CheckOrX({ value }: { value: boolean }) {
  return (
    <span style={{ color: value ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
      {value ? "\u2713" : "X"}
    </span>
  );
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : "";
  const id = parseInt(idParam, 10);

  const [service, setService] = useState<ServiceDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px]">
          <p className="font-roboto text-red-600">Invalid service.</p>
          <Link href="/Services" className={backButtonClass + " mt-4 inline-block"}>
            Back To Index
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
          <Link href="/Services" className={backButtonClass + " mt-4 inline-block"}>
            Back To Index
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
        <div className="text-center mb-4">
          <h2
            className="font-roboto"
            style={{ fontSize: "30px", fontWeight: "normal", color: "#000000" }}
          >
            Professional Service Record Details
          </h2>
          <p className="font-roboto mt-2" style={{ fontSize: "24px", color: "#000000" }}>
            Service Record Id:{" "}
            {!s ? (
              <span
                style={{
                  display: "inline-block",
                  width: "48px",
                  height: "24px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "4px",
                  verticalAlign: "middle",
                }}
              />
            ) : (
              <span style={{ color: "#900" }}>{s.id}</span>
            )}
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
            label="Company:"
            value={s ? s.companyName || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Staff Member:"
            value={s ? s.staffMember || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Field Staff:"
            value={s != null ? String(s.fieldStaff) : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="County:"
            value={s ? s.county || "\u2014" : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Employees Trained:"
            value={s != null ? String(s.numberEmployeesTrained) : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Certificate Awarded:"
            value={s != null ? <CheckOrX value={s.certificate} /> : "\u2014"}
            skeleton={showSkeleton}
          />
          <DetailRow
            label="Intern Participants:"
            value={s != null ? String(s.numberInterns) : "\u2014"}
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
          <DetailRow
            label="Completed:"
            value={s != null ? <CheckOrX value={s.completed} /> : "\u2014"}
            skeleton={showSkeleton}
          />
        </div>

        <div className="flex items-center gap-3 mt-8">
          <Link href="/Services" className={actionButtonClass} style={{ textDecoration: "none" }}>
            Back To Index
          </Link>
          <Link
            href={`/Services/Edit/${id}`}
            className={actionButtonClass}
            style={{ textDecoration: "none" }}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
