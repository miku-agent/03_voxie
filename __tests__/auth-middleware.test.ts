import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";

// Mock the Supabase client
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

describe("auth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  it("allows unauthenticated access to public routes", async () => {
    // Mock unauthenticated user
    const { createServerClient } = await import("@supabase/ssr");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    const request = new NextRequest(new URL("http://localhost:3000/"));
    const response = await middleware(request);

    // Should not redirect
    expect(response).toBeDefined();
    expect(response.status).not.toBe(307); // Not a redirect
  });

  it("redirects unauthenticated users from protected routes to auth", async () => {
    const protectedRoutes = ["/decks/new", "/cards/new", "/profile"];

    for (const route of protectedRoutes) {
      const request = new NextRequest(new URL(`http://localhost:3000${route}`));

      // Mock unauthenticated user
      const { createServerClient } = await import("@supabase/ssr");
      vi.mocked(createServerClient).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as never);

      const response = await middleware(request);

      // Should redirect to auth with redirectedFrom param
      expect(response.status).toBe(307); // Temporary redirect
      expect(response.headers.get("location")).toContain("/auth");
      expect(response.headers.get("location")).toContain(`redirectedFrom=${encodeURIComponent(route)}`);
    }
  });

  it("redirects authenticated users from auth page to home or intended destination", async () => {
    // Mock authenticated user
    const { createServerClient } = await import("@supabase/ssr");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-123",
              email: "test@example.com"
            }
          },
          error: null
        }),
      },
    } as never);

    // Test redirect to home when no redirectedFrom param
    const authRequest = new NextRequest(new URL("http://localhost:3000/auth"));
    const authResponse = await middleware(authRequest);

    expect(authResponse.status).toBe(307);
    expect(authResponse.headers.get("location")).toBe("http://localhost:3000/");

    // Test redirect to intended destination
    const authWithRedirect = new NextRequest(
      new URL("http://localhost:3000/auth?redirectedFrom=/decks/new")
    );
    const redirectResponse = await middleware(authWithRedirect);

    expect(redirectResponse.status).toBe(307);
    expect(redirectResponse.headers.get("location")).toBe("http://localhost:3000/decks/new");
  });

  it("handles missing Supabase configuration gracefully", async () => {
    // Clear environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const request = new NextRequest(new URL("http://localhost:3000/decks/new"));
    const response = await middleware(request);

    // Should not crash, just pass through
    expect(response).toBeDefined();
  });
});