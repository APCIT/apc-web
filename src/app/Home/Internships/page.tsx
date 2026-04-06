import { getSession, hasLoggedInUser } from "@/lib/auth";
import InternshipsClient from "./InternshipsClient";

export default async function InternshipsPage() {
  const session = await getSession();
  const showApplyButton = !hasLoggedInUser(session);
  return <InternshipsClient showApplyButton={showApplyButton} />;
}
