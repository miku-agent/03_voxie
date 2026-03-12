"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "signin" | "signup";
type SocialProvider = "google" | "kakao";

const socialProviders: Array<{ provider: SocialProvider; label: string; theme?: string }> = [
  { provider: "google", label: "Google" },
  { provider: "kakao", label: "카카오", theme: "bg-[#FEE500] text-[#000000] hover:bg-[#FDD835]" },
];

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const redirectedFrom = searchParams.get("redirectedFrom");
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const enabledProviders = socialProviders.filter(({ provider }) => {
    if (provider === "kakao") {
      return process.env.NEXT_PUBLIC_ENABLE_KAKAO_AUTH === "1";
    }
    return true;
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase auth is not configured yet.");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const response =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

    setSubmitting(false);

    if (response.error) {
      setStatus(response.error.message);
      return;
    }

    if (mode === "signin" && response.data.user) {
      const redirectTo = redirectedFrom || "/";
      router.push(redirectTo);
      router.refresh();
    } else if (mode === "signup") {
      setStatus("가입 요청이 처리됐어요. 메일 인증이 켜져 있으면 확인 후 로그인해 주세요.");
      if (response.data.user && response.data.session) {
        const redirectTo = redirectedFrom || "/";
        router.push(redirectTo);
        router.refresh();
      }
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (!supabase) {
      setStatus("Supabase auth is not configured yet.");
      return;
    }

    setSubmitting(true);
    setStatus(`${provider === "google" ? "Google" : "카카오"} 로그인으로 이동하는 중...`);
    const redirectTo = `${window.location.origin}/auth/callback${redirectedFrom ? `?next=${encodeURIComponent(redirectedFrom)}` : ""}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setSubmitting(false);
      setStatus(error.message);
    }
  };

  return (
    <div className="terminal-shell p-5 sm:p-6">
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          className="terminal-chip"
          data-active={mode === "signin"}
          onClick={() => setMode("signin")}
        >
          로그인
        </button>
        <button
          type="button"
          className="terminal-chip"
          data-active={mode === "signup"}
          onClick={() => setMode("signup")}
        >
          회원가입
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm text-[var(--terminal-muted)]">이메일</label>
          <input
            className="auth-input w-full px-3 py-3"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@voxie.dev"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--terminal-muted)]">비밀번호</label>
          <input
            className="auth-input w-full px-3 py-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자 이상"
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="terminal-button w-full" disabled={submitting}>
          {submitting ? "처리 중..." : mode === "signin" ? "로그인" : "회원가입"}
        </button>
      </form>

      {enabledProviders.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--terminal-frame-border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--terminal-bg)] px-2 text-[var(--terminal-muted)]">또는</span>
            </div>
          </div>

          {enabledProviders.map(({ provider, label, theme }) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocialLogin(provider)}
              className={`terminal-button flex w-full items-center justify-center gap-2 ${theme ?? ""}`.trim()}
              disabled={submitting}
            >
              {label}로 {mode === "signin" ? "로그인" : "시작하기"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 text-xs leading-6 text-[var(--terminal-muted)]">
        <p>Supabase Auth 세션으로 로그인 상태가 즉시 반영돼요.</p>
        <p>로그인 후 likes / bookmarks / follows 가 내 계정 기준으로 저장됩니다.</p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-[var(--terminal-error)]">
          오류: {decodeURIComponent(error)}
        </p>
      )}
      {!error && message && (
        <p className="mt-4 text-sm text-[var(--terminal-soft)]">{decodeURIComponent(message)}</p>
      )}
      {status && <p className="mt-4 text-sm text-[var(--terminal-soft)]">{status}</p>}
    </div>
  );
}
