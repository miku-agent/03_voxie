import Link from "next/link";
import CardCreateClient from "./CardCreateClient";
import { getCurrentUser } from "@/lib/auth";
import AuthRequiredNotice from "@/components/AuthRequiredNotice";

export default async function CardCreatePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="terminal-shell p-6">
            <Link className="text-sm text-[var(--terminal-muted)]" href="/">
              ← 카드 목록
            </Link>
            <h1 className="mt-4 text-2xl font-semibold">카드 추가는 로그인 후에 가능해요</h1>
            <AuthRequiredNotice
              className="mt-4 border border-[var(--terminal-border)] px-4 py-3 text-sm leading-7 text-[var(--terminal-soft)]"
              message="카드 생성은 작성 권한이 필요한 액션입니다."
            />
          </div>
        </main>
      </div>
    );
  }

  return <CardCreateClient />;
}
