"use client";

import { ConsultationTable } from "./ConsultationTable";
import { ConsultationTableTabs } from "./ConsultationTableTabs";
import { useGetConsultations } from "@/services/consultation/consultation.queries";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export const ConsultationTableContainer = ({ user }: { user: User }) => {
  const { data: consultations, isLoading } = useGetConsultations(user.id);

  return (
    <div className="space-y-4">
      <ConsultationTableTabs />
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <ConsultationTable data={consultations ?? []} />
      )}
    </div>
  );
};
