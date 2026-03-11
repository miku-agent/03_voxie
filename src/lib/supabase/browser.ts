"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseEnv } from "./client";

let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
