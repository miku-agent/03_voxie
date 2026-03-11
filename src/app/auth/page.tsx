import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import AuthForm from "./AuthForm";

export default async function AuthPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="terminal-shell p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">auth entrypoint</p>
            <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Voxie 로그인 흐름</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">
              이제 Voxie에도 실제 로그인 진입점이 생겨요. 이번 단계에서는 Supabase Auth 기반 세션을 붙여서,
              앱이 현재 사용자를 인식할 수 있는 토대를 만듭니다.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="terminal-frame p-4">
                <p className="text-xs text-[var(--terminal-muted)]">현재 상태</p>
                <p className="mt-2 text-sm font-semibold">
                  {user ? `로그인됨 · ${user.email ?? user.id}` : "로그인 안 됨"}
                </p>
              </div>
              <div className="terminal-frame p-4">
                <p className="text-xs text-[var(--terminal-muted)]">Supabase Auth</p>
                <p className="mt-2 text-sm font-semibold">{configured ? "configured" : "not configured"}</p>
              </div>
            </div>

            <div className="mt-6 terminal-frame p-4 text-sm leading-7 text-[var(--terminal-soft)]">
              <p>이번 PR 범위</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--terminal-muted)]">
                <li>로그인 / 회원가입 / 로그아웃 진입점</li>
                <li>서버와 레이아웃에서 current user 읽기</li>
                <li>로그인 상태를 UI에서 구분해서 보여주기</li>
              </ul>
            </div>
          </div>

          {configured ? (
            <AuthForm />
          ) : (
            <div className="terminal-frame p-5 text-sm leading-7 text-[var(--terminal-soft)]">
              <p className="font-semibold">Supabase Auth 환경 변수가 아직 연결되지 않았어요.</p>
              <p className="mt-3 text-[var(--terminal-muted)]">
                `SUPABASE_URL` / `SUPABASE_ANON_KEY` 또는 `NEXT_PUBLIC_SUPABASE_URL` /
                `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 있어야 실제 로그인 흐름이 동작합니다.
              </p>
              <Link href="/" className="mt-4 inline-flex text-sm text-[var(--terminal-soft)]">
                홈으로 돌아가기 →
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
