import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { getSupabaseEnv } from "./client";
import { decodeMockAuthCookie, isMockAuthEnabled, MOCK_AUTH_COOKIE } from "@/lib/mock-auth";

function createMockQuery(data: unknown = null) {
  const result = Promise.resolve({ data, error: null });
  const chain = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    in: () => chain,
    order: () => chain,
    maybeSingle: () => Promise.resolve({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
    single: () => Promise.resolve({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  };

  return chain;
}

export async function createSupabaseServerClient() {
  if (isMockAuthEnabled()) {
    const cookieStore = await cookies();
    const user = decodeMockAuthCookie(cookieStore.get(MOCK_AUTH_COOKIE)?.value);

    return {
      auth: {
        getUser: async () => ({
          data: { user },
          error: null,
        }),
        signOut: async () => ({ error: null }),
      },
      from: () => createMockQuery([]),
    } as never;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // no-op in render contexts where cookie writes are not allowed
        }
      },
    },
  });
}
