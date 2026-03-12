import type { User } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

export const MOCK_AUTH_FLAG = "PLAYWRIGHT_AUTH_MOCK";
export const MOCK_AUTH_COOKIE = "voxie_mock_auth";

export type MockAuthUser = Pick<User, "id" | "email" | "user_metadata" | "app_metadata">;

export function isMockAuthEnabled() {
  return process.env[MOCK_AUTH_FLAG] === "1";
}

export function createMockAuthUser(input: {
  email: string;
  provider?: "email" | "google" | "kakao";
  name?: string;
}): MockAuthUser {
  const emailPrefix = input.email.split("@")[0] || "voxie-user";
  const provider = input.provider ?? "email";
  const name = input.name ?? (provider === "email" ? emailPrefix : `${capitalize(emailPrefix)} Curator`);

  const mappedId =
    input.email === "e2e-user@voxie.dev"
      ? "user-1"
      : `mock-${provider}-${sanitizeSegment(input.email)}`;

  return {
    id: mappedId,
    email: input.email,
    app_metadata: provider === "email" ? { provider } : { provider, providers: [provider] },
    user_metadata: {
      name,
      full_name: name,
      user_name: emailPrefix,
      preferred_username: emailPrefix,
    },
  };
}

export function encodeMockAuthCookie(user: MockAuthUser) {
  return encodeURIComponent(JSON.stringify(user));
}

export function decodeMockAuthCookie(value?: string | null): MockAuthUser | null {
  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value)) as MockAuthUser;
  } catch {
    return null;
  }
}

export function readMockAuthUserFromRequest(request: NextRequest) {
  return decodeMockAuthCookie(request.cookies.get(MOCK_AUTH_COOKIE)?.value);
}

export function writeMockAuthCookie(response: NextResponse, user: MockAuthUser | null) {
  if (!user) {
    response.cookies.set(MOCK_AUTH_COOKIE, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return;
  }

  response.cookies.set(MOCK_AUTH_COOKIE, encodeMockAuthCookie(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

function sanitizeSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function capitalize(value: string) {
  return value ? `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}` : value;
}
