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
