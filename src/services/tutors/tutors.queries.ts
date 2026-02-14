import { useQuery } from "@tanstack/react-query";
import { tutorsService } from "./tutors.service";
import { Tutor } from "./tutors.service";

export const useGetTutors = () => {
  return useQuery<Tutor[]>({
    queryKey: ["tutors"],
    queryFn: () => tutorsService.getTutors(),
  });
};
