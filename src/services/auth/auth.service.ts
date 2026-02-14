import { supabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export const authService = {
  login: async (
    email: string,
    password: string
  ): Promise<{ data: User | null; error: string | null }> => {
    const { data, error } = await supabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.user, error: null };
  },
  register: async (
    email: string,
    password: string
  ): Promise<{ data: User | null; error: string | null }> => {
    const { data, error } = await supabaseClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.user, error: null };
  },
  logout: async () => {
    const { error } = await supabaseClient().auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },
};
