import { describe, expect, it, vi } from "vitest";
import { getSupabaseEnv } from "@/lib/supabase/client";

describe("supabase env resolution", () => {
  it("prefers server env names when present", () => {
    vi.stubEnv("SUPABASE_URL", "https://server.example");
    vi.stubEnv("SUPABASE_ANON_KEY", "server-key");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://public.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-key");

    expect(getSupabaseEnv()).toEqual({
      supabaseUrl: "https://server.example",
      supabaseAnonKey: "server-key",
    });

    vi.unstubAllEnvs();
  });

  it("falls back to NEXT_PUBLIC env names", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://public.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-key");

    expect(getSupabaseEnv()).toEqual({
      supabaseUrl: "https://public.example",
      supabaseAnonKey: "public-key",
    });

    vi.unstubAllEnvs();
  });
});
