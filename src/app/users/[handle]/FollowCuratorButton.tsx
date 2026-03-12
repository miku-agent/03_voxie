"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toggleCuratorFollow } from "@/lib/actions/social";

type Props = {
  handle: string;
  name: string;
  initialFollowers: number;
  initiallyFollowing: boolean;
  requiresAuth: boolean;
};

export default function FollowCuratorButton({ handle, name, initialFollowers, initiallyFollowing, requiresAuth }: Props) {
  const [followed, setFollowed] = useState(initiallyFollowing);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const followers = useMemo(
    () => initialFollowers + (followed ? 1 : 0) - (initiallyFollowing ? 1 : 0),
    [initialFollowers, followed, initiallyFollowing],
  );

  const handleToggle = () => {
    startTransition(async () => {
      const previous = followed;
      setStatus(null);
      setFollowed(!previous);
      const result = await toggleCuratorFollow(handle);
      if (!result.success) {
        setFollowed(previous);
        setStatus(result.error ?? "팔로우 상태를 저장하지 못했어요.");
        return;
      }
      setFollowed(Boolean(result.followed));
    });
  };

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {requiresAuth ? (
        <div className="w-full border border-[var(--terminal-border)] px-3 py-3 text-xs leading-6 text-[var(--terminal-soft)] sm:w-auto">
          팔로우를 저장하려면 먼저 로그인해 주세요. <Link href="/auth" className="underline underline-offset-4">로그인하러 가기 →</Link>
        </div>
      ) : (
        <button type="button" className="terminal-button w-full sm:w-auto" onClick={handleToggle} disabled={pending}>
          {followed ? `${name} 언팔로우` : `${name} 팔로우`}
        </button>
      )}
      <span className="text-sm text-[var(--terminal-muted)]">팔로워 {followers}</span>
      {status && <p className="w-full text-xs leading-6 text-[var(--terminal-soft)]">{status}</p>}
    </div>
  );
}
