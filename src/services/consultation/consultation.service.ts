import { supabaseClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";

export type ConsultationWithTutor = Tables<"consultations"> & {
  tutors: Tables<"tutors">;
};

export const consultationService = {
  getConsultations: async (
    userId: string
  ): Promise<ConsultationWithTutor[]> => {
    const { data, error } = await supabaseClient()
      .from("consultations")
      .select("*, tutors(id, first_name, last_name)")
      .eq("user_id", userId);

    if (error) throw error;

    return data as ConsultationWithTutor[];
  },
};
