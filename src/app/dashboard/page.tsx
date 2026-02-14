import { ConsultationTableContainer } from "@/features/dashboard/ConsultationTableContainer";
import { PageWrapper } from "@/components/ui/pageWrapper";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);

  if (!user) redirect("/");

  return (
    <PageWrapper>
      <ConsultationTableContainer />
    </PageWrapper>
  );
}
