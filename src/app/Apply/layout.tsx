import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession, hasLoggedInUser } from "@/lib/auth";

export default async function ApplyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await getSession();
  if (hasLoggedInUser(session)) {
    redirect("/Manage");
  }
  return <>{children}</>;
}
