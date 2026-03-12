import { NextResponse } from "next/server";
import {
  createMockAuthUser,
  isMockAuthEnabled,
  writeMockAuthCookie,
} from "@/lib/mock-auth";

export async function POST(request: Request) {
  if (!isMockAuthEnabled()) {
    return NextResponse.json({ error: "Mock auth is disabled" }, { status: 404 });
  }

  const body = (await request.json()) as {
    action?: "signin" | "signup" | "oauth" | "signout";
    email?: string;
    provider?: "google" | "kakao";
    redirectTo?: string;
  };

  const action = body.action;

  if (action === "signout") {
    const response = NextResponse.json({ ok: true });
    writeMockAuthCookie(response, null);
    return response;
  }

  if (action === "signin" || action === "signup") {
    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "이메일을 입력해 주세요." }, { status: 400 });
    }

    const user = createMockAuthUser({ email, provider: "email" });
    const response = NextResponse.json({
      user,
      session: { access_token: "mock-access-token" },
    });
    writeMockAuthCookie(response, user);
    return response;
  }

  if (action === "oauth") {
    const provider = body.provider;
    if (!provider || (provider !== "google" && provider !== "kakao")) {
      return NextResponse.json({ error: "지원하지 않는 provider입니다." }, { status: 400 });
    }

    const baseUrl = new URL(request.url);
    const callbackUrl = new URL("/auth/callback", baseUrl.origin);
    callbackUrl.searchParams.set("code", `mock-${provider}-code`);
    callbackUrl.searchParams.set("provider", provider);

    if (body.redirectTo) {
      const desired = new URL(String(body.redirectTo), baseUrl.origin);
      const next = desired.searchParams.get("next");
      if (next) callbackUrl.searchParams.set("next", next);
    }

    return NextResponse.json({ redirectUrl: callbackUrl.toString() });
  }

  return NextResponse.json({ error: "잘못된 mock auth 요청입니다." }, { status: 400 });
}
