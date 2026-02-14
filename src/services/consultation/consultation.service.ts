import { supabaseClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";

export type ConsultationWithTutor = Tables<"consultations"> & {
  tutors: Tables<"tutors">;
};

export type ConsultationInsert = {
  reason: string;
  user_id: string;
  tutor_id: string;
};

export const consultationService = {
  getConsultations: async (
    userId: string
  ): Promise<ConsultationWithTutor[]> => {
    const { data, error } = await supabaseClient()
      .from("consultations")
      .select("*, tutors(id, first_name, last_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as ConsultationWithTutor[];
  },
  createConsultation: async (consultation: ConsultationInsert) => {
    const { error } = await supabaseClient()
      .from("consultations")
      .insert(consultation);

    if (error) throw error;
    return true;
  },
  updateStatus: async (id: string, status: string) => {
    const { error } = await supabaseClient()
      .from("consultations")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};
