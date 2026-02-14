import { supabaseClient } from "@/lib/supabase/client";

export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  register: async (email: string, password: string) => {
    const { data, error } = await supabaseClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  logout: async () => {
    const { error } = await supabaseClient().auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },
};
