import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-8 py-4">
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontSize: "1.5em",
              fontWeight: "normal",
              color: "#333333",
              fontFamily: "Roboto, sans-serif",
              textAlign: "center",
            }}
          >
            Access denied
          </h2>
          <hr
            style={{
              marginTop: "0.5rem",
              borderColor: "#999999",
              borderWidth: "1px",
              borderStyle: "solid",
              borderBottom: "none",
            }}
          />
        </div>
        <p style={{ color: "#333333", textAlign: "center", marginBottom: "1rem" }}>
          You don&apos;t have permission to view this page.
        </p>
        <p style={{ textAlign: "center" }}>
          <Link
            href="/Manage"
            style={{ color: "#990000", textDecoration: "underline" }}
          >
            Go to My Account
          </Link>
          {" · "}
          <Link href="/" style={{ color: "#990000", textDecoration: "underline" }}>
            Go to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
