import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCookie, COOKIE_NAME } from "@/lib/adminAuth";
import { supabase, type Submission } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Full HMAC verification — runs on Node runtime, crypto is available here
  const cookieStore = cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session || !verifyCookie(session)) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions: Submission[] = (data as Submission[]) ?? [];

  return <AdminDashboard submissions={submissions} error={error?.message} />;
}
