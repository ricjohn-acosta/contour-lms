import { useMutation } from "@tanstack/react-query";
import {
  ConsultationInsert,
  consultationService,
} from "./consultation.service";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export const useBookConsultation = () => {
  return useMutation({
    mutationFn: (consultation: ConsultationInsert) => {
      return consultationService.createConsultation(consultation);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["consultations"] });
    },
  });
};

export const useMarkConsultationComplete = () => {
  return useMutation({
    mutationFn: (consultationId: string) => {
      return consultationService.updateStatus(consultationId, "complete");
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["consultations"] });
      toast.success("Consultation marked as complete.");
    },
    onError: () => {
      toast.error("Failed to update consultation.");
    },
  });
};

export const useMarkConsultationIncomplete = () => {
  return useMutation({
    mutationFn: (consultationId: string) => {
      return consultationService.updateStatus(consultationId, "incomplete");
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["consultations"] });
      toast.success("Consultation marked as incomplete.");
    },
    onError: () => {
      toast.error("Failed to update consultation.");
    },
  });
};
