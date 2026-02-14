import { useQuery } from "@tanstack/react-query";
import {
  consultationService,
  ConsultationWithTutor,
} from "./consultation.service";

export const useGetConsultations = (userId: string) => {
  return useQuery<ConsultationWithTutor[]>({
    queryKey: ["consultations"],
    queryFn: () => consultationService.getConsultations(userId),
  });
};
