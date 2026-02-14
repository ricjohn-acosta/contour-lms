import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomSidebar } from "@/features/sidebar/CustomSidebar";
import { BookConsultationDialog } from "@/features/consultation/BookConsultationDialog";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <SidebarProvider>
      <CustomSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />

          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-bold">Your consultations</div>
            <BookConsultationDialog user={user} />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
