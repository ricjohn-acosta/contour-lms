"use client";

import { ConsultationTable } from "./ConsultationTable";
import {
  ConsultationTableTabs,
  type ConsultationStatusFilter,
} from "./ConsultationTableTabs";
import type { ConsultationWithTutor } from "@/services/consultation/consultation.service";
import { useGetConsultations } from "@/services/consultation/consultation.queries";
import { User } from "@supabase/supabase-js";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

export const ConsultationTableContainer = ({ user }: { user: User }) => {
  const [status, setStatus] = useState<ConsultationStatusFilter>("all");

  const { data: consultations, isLoading } = useGetConsultations(user.id);

  const filterByStatus = (
    consultations: ConsultationWithTutor[],
    status: ConsultationStatusFilter
  ): ConsultationWithTutor[] => {
    if (status === "all") return consultations;
    const isComplete = status === "complete";
    return consultations.filter((c) => {
      const complete = c.status?.toLowerCase() === "complete";
      return complete === isComplete;
    });
  };

  const filteredConsultations = useMemo(
    () => filterByStatus(consultations ?? [], status),
    [consultations, status]
  );

  return (
    <div className="space-y-4">
      <ConsultationTableTabs value={status} onValueChange={setStatus} />
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <ConsultationTable data={filteredConsultations} />
      )}
    </div>
  );
};
