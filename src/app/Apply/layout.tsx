import type { ReactNode } from "react";

/** Logged-in users may open /Apply to read the form; submission is blocked in the API and on the client. */
export default function ApplyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
