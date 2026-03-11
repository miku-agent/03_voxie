"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toggleDeckBookmark, toggleDeckLike } from "@/lib/actions/social";

type Props = {
  slug: string;
  initialLikes: number;
  initialBookmarks: number;
  initiallyLiked: boolean;
  initiallyBookmarked: boolean;
  curatorName?: string;
  initialFollowers: number;
  requiresAuth: boolean;
};

export default function SocialActions({
  slug,
  initialLikes,
  initialBookmarks,
  initiallyLiked,
  initiallyBookmarked,
  curatorName,
  initialFollowers,
  requiresAuth,
}: Props) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [followed, setFollowed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const likes = useMemo(() => initialLikes + (liked ? 1 : 0) - (initiallyLiked ? 1 : 0), [initialLikes, liked, initiallyLiked]);
  const bookmarks = useMemo(
    () => initialBookmarks + (bookmarked ? 1 : 0) - (initiallyBookmarked ? 1 : 0),
    [initialBookmarks, bookmarked, initiallyBookmarked],
  );
  const followers = useMemo(() => initialFollowers + (followed ? 1 : 0), [initialFollowers, followed]);

  const handleLike = () => {
    startTransition(async () => {
      const previous = liked;
      setStatus(null);
      setLiked(!previous);
      const result = await toggleDeckLike(slug);
      if (!result.success) {
        setLiked(previous);
        setStatus(result.error ?? "좋아요 상태를 저장하지 못했어요.");
        return;
      }
      setLiked(Boolean(result.liked));
    });
  };

  const handleBookmark = () => {
    startTransition(async () => {
      const previous = bookmarked;
      setStatus(null);
      setBookmarked(!previous);
      const result = await toggleDeckBookmark(slug);
      if (!result.success) {
        setBookmarked(previous);
        setStatus(result.error ?? "북마크 상태를 저장하지 못했어요.");
        return;
      }
      setBookmarked(Boolean(result.bookmarked));
    });
  };

  return (
    <div className="terminal-frame p-4">
      <p className="text-sm font-semibold">가벼운 액션</p>
      <p className="mt-2 text-xs leading-6 text-[var(--terminal-muted)]">
        이제 좋아요와 북마크는 로그인한 사용자 기준으로 실제 저장돼요. 팔로우는 아직 다음 단계에서 이어집니다.
      </p>

      {requiresAuth && (
        <div className="mt-4 border border-[var(--terminal-border)] px-3 py-3 text-xs leading-6 text-[var(--terminal-soft)]">
          반응을 저장하려면 먼저 로그인해 주세요. <Link href="/auth" className="underline underline-offset-4">로그인하러 가기 →</Link>
        </div>
      )}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          className="terminal-button w-full justify-between"
          onClick={handleLike}
          disabled={pending}
        >
          <span>{liked ? "좋아요 취소" : "좋아요"}</span>
          <span>{likes}</span>
        </button>
        <button
          type="button"
          className="terminal-button w-full justify-between"
          onClick={handleBookmark}
          disabled={pending}
        >
          <span>{bookmarked ? "북마크 해제" : "북마크"}</span>
          <span>{bookmarks}</span>
        </button>
        <button
          type="button"
          className="terminal-button w-full justify-between"
          onClick={() => setFollowed((value) => !value)}
        >
          <span>{followed ? `${curatorName ?? "큐레이터"} 언팔로우` : `${curatorName ?? "큐레이터"} 팔로우`}</span>
          <span>{followers}</span>
        </button>
      </div>

      {status && <p className="mt-3 text-xs leading-6 text-[var(--terminal-soft)]">{status}</p>}
    </div>
  );
}
