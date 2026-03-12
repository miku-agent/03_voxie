import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "@/app/auth/callback/route";
import { NextResponse } from "next/server";

// Mock dependencies
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: vi.fn(),
    },
  })),
}));

describe("auth callback route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  it("handles successful code exchange and redirects", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: "token" }, user: { id: "user-123" } },
          error: null,
        }),
      },
    } as never);

    const request = new Request("http://localhost:3000/auth/callback?code=test-code&next=/dashboard");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("handles code exchange errors gracefully", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Invalid authorization code" },
        }),
      },
    } as never);

    const request = new Request("http://localhost:3000/auth/callback?code=invalid-code");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth?error=");
    expect(response.headers.get("location")).toContain("Invalid%20authorization%20code");
  });

  it("handles auth errors from OAuth providers", async () => {
    const request = new Request(
      "http://localhost:3000/auth/callback?error=access_denied&error_description=User%20cancelled%20authorization"
    );
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth?error=User%20cancelled%20authorization");
  });

  it("redirects to auth page when no code is provided", async () => {
    const request = new Request("http://localhost:3000/auth/callback");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/auth");
  });

  it("handles missing Supabase configuration", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const request = new Request("http://localhost:3000/auth/callback?code=test-code");
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth?error=Configuration%20error");
  });
});