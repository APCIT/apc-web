"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ThankyouPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "Thank you.";
  const name = searchParams.get("name") ?? "";

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <h2 className="text-[24px] font-normal text-left text-black mb-4">
          Thank You
        </h2>
        <p className="text-[16px] text-[#333] mb-4">{message}</p>
        {name && (
          <p className="text-[16px] text-[#333] mb-6">
            We&apos;ll be in touch soon, {name}.
          </p>
        )}
        <p>
          <Link
            href="/Manage"
            className="text-[#666666] font-roboto text-sm no-underline hover:underline"
          >
            ← Back to My Account
          </Link>
        </p>
      </div>
    </div>
  );
}
