import { AuthContainer } from "@/features/auth/AuthContainer";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return <AuthContainer />;
}
