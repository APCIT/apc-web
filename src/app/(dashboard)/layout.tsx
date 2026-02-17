import { getSession } from "@/lib/auth";
import { canAccessPath } from "@/lib/auth-routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.isLoggedIn) {
    const pathname = (await headers()).get("x-pathname") ?? "/Manage";
    redirect(`/Account/Login?returnUrl=${encodeURIComponent(pathname)}`);
  }

  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname && !canAccessPath(pathname, session.roles ?? [])) {
    redirect("/Account/Unauthorized");
  }

  return <>{children}</>;
}
