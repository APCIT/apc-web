"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeadingIntroBanner from "@/components/HeadingIntroBanner";

export default function ApplyThankyouPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";

  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: "#eee", minHeight: "calc(100vh - 100px)" }}>
      <HeadingIntroBanner
        title="Thank You"
        backgroundImage="/images/industry-798642.jpg"
        backgroundPosition="bottom"
        height="15em"
      />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1rem", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "28px",
            color: "#900",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Application Submitted
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#333",
            fontFamily: "Roboto, sans-serif",
            marginBottom: "0.75rem",
          }}
        >
          Thank you for applying{name ? `, ${name}` : ""}!
        </p>
        <p
          style={{
            fontSize: "1rem",
            color: "#666",
            fontFamily: "Roboto, sans-serif",
            marginBottom: "2rem",
          }}
        >
          We&apos;ll review your application and be in touch soon.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#9E1B32",
            color: "#fff",
            border: "none",
            padding: "0.65rem 2rem",
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: "4px",
            textDecoration: "none",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
