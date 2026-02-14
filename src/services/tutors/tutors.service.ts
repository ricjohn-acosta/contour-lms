import { supabaseClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";

export type Tutor = Tables<"tutors">;

export const tutorsService = {
  getTutors: async (): Promise<Tutor[]> => {
    const { data, error } = await supabaseClient().from("tutors").select("*");
    if (error) throw error;
    return data;
  },
};
