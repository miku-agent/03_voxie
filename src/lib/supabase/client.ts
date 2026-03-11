import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

class SupabaseClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseClientError";
  }
}

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables not configured. Using fallback mode with local data."
    );
    return null;
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}

export const supabase = createSupabaseClient();

export function requireSupabaseClient() {
  if (!supabase) {
    throw new SupabaseClientError(
      "Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
    );
  }
  return supabase;
}

export function isSupabaseConfigured(): boolean {
  return !!supabase;
}

export type SupabaseCard = Database["public"]["Tables"]["cards"]["Row"];
export type SupabaseDeck = Database["public"]["Tables"]["decks"]["Row"];
export type SupabaseDeckCard = Database["public"]["Tables"]["deck_cards"]["Row"];