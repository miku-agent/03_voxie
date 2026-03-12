import { createClient } from "@supabase/supabase-js";
import { isMockAuthEnabled } from "@/lib/mock-auth";
import { Database } from "./types";

export function getSupabaseEnv() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

class SupabaseClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseClientError";
  }
}

export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

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
  return isMockAuthEnabled() || !!supabase;
}

export type SupabaseCard = Database["public"]["Tables"]["cards"]["Row"];
export type SupabaseDeck = Database["public"]["Tables"]["decks"]["Row"];
export type SupabaseDeckCard = Database["public"]["Tables"]["deck_cards"]["Row"];