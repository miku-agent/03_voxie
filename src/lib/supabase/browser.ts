"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Provider, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseEnv } from "./client";

let browserClient: SupabaseClient<Database> | null = null;

type MockAuthResponse = {
  user?: {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
  session?: { access_token: string } | null;
  redirectUrl?: string;
  error?: string;
};

function isMockAuthEnabledInBrowser() {
  return process.env.NEXT_PUBLIC_PLAYWRIGHT_AUTH_MOCK === "1";
}

async function postMockAuth(action: string, payload: Record<string, unknown>) {
  const response = await fetch("/auth/mock", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ action, ...payload }),
  });

  const data = (await response.json()) as MockAuthResponse;
  if (!response.ok || data.error) {
    return {
      data: { user: null, session: null, url: null },
      error: { message: data.error ?? "Mock auth request failed" },
    };
  }

  return {
    data: {
      user: data.user ?? null,
      session: data.session ?? null,
      url: data.redirectUrl ?? null,
    },
    error: null,
  };
}

function createMockBrowserClient() {
  return {
    auth: {
      signInWithPassword: async ({ email }: { email: string; password: string }) => {
        return postMockAuth("signin", { email });
      },
      signUp: async ({ email }: { email: string; password: string; options?: { emailRedirectTo?: string } }) => {
        return postMockAuth("signup", { email });
      },
      signInWithOAuth: async ({
        provider,
        options,
      }: {
        provider: Provider;
        options?: { redirectTo?: string };
      }) => {
        const result = await postMockAuth("oauth", {
          provider,
          redirectTo: options?.redirectTo,
        });

        if (!result.error && result.data.url) {
          window.location.assign(result.data.url);
        }

        return result;
      },
    },
  } as unknown as SupabaseClient<Database>;
}

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  if (isMockAuthEnabledInBrowser()) {
    browserClient = createMockBrowserClient();
    return browserClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
