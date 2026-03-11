import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

export default async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link className="nav-link" href="/auth">
        로그인
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--terminal-soft)]">
      <Link className="nav-link" href="/auth">
        {user.email ?? "내 계정"}
      </Link>
      <form action={signOut}>
        <button type="submit" className="nav-link cursor-pointer">
          로그아웃
        </button>
      </form>
    </div>
  );
}
