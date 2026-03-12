import { describe, expect, it, vi } from "vitest";
import { getCurrentUser, isLoggedIn } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Mock Next.js functions
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

describe("auth flow integration", () => {
  it("getCurrentUser returns user when authenticated", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-123",
              email: "test@example.com",
              user_metadata: {},
            },
          },
          error: null,
        }),
      },
    } as never);

    const user = await getCurrentUser();
    expect(user).toEqual({
      id: "user-123",
      email: "test@example.com",
      user_metadata: {},
    });
  });

  it("getCurrentUser returns null when not authenticated", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as never);

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("getCurrentUser returns null when Supabase is not configured", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue(null);

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("isLoggedIn returns correct boolean state", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");

    // Test logged in state
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123" } },
          error: null,
        }),
      },
    } as never);

    expect(await isLoggedIn()).toBe(true);

    // Test logged out state
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as never);

    expect(await isLoggedIn()).toBe(false);
  });

  it("signOut clears session and redirects", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never);

    await signOut();

    // Should revalidate cache and redirect
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("signOut handles errors gracefully", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        signOut: vi.fn().mockResolvedValue({
          error: { message: "Sign out failed" },
        }),
      },
    } as never);

    await signOut();

    // Should log error but still redirect
    expect(consoleErrorSpy).toHaveBeenCalledWith("Sign out error:", { message: "Sign out failed" });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");

    consoleErrorSpy.mockRestore();
  });
});