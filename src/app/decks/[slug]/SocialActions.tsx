"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toggleCuratorFollow, toggleDeckBookmark, toggleDeckLike } from "@/lib/actions/social";
import AuthRequiredNotice from "@/components/AuthRequiredNotice";

type Props = {
  slug: string;
  initialLikes: number;
  initialBookmarks: number;
  initiallyLiked: boolean;
  initiallyBookmarked: boolean;
  curatorHandle?: string;
  curatorName?: string;
  initialFollowers: number;
  initiallyFollowing: boolean;
  requiresAuth: boolean;
  followRequiresAuth: boolean;
};

export default function SocialActions({
  slug,
  initialLikes,
  initialBookmarks,
  initiallyLiked,
  initiallyBookmarked,
  curatorHandle,
  curatorName,
  initialFollowers,
  initiallyFollowing,
  requiresAuth,
  followRequiresAuth,
}: Props) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [followed, setFollowed] = useState(initiallyFollowing);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const likes = useMemo(() => initialLikes + (liked ? 1 : 0) - (initiallyLiked ? 1 : 0), [initialLikes, liked, initiallyLiked]);
  const bookmarks = useMemo(
    () => initialBookmarks + (bookmarked ? 1 : 0) - (initiallyBookmarked ? 1 : 0),
    [initialBookmarks, bookmarked, initiallyBookmarked],
  );
  const followers = useMemo(
    () => initialFollowers + (followed ? 1 : 0) - (initiallyFollowing ? 1 : 0),
    [initialFollowers, followed, initiallyFollowing],
  );

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

  const handleFollow = () => {
    if (!curatorHandle) return;

    startTransition(async () => {
      const previous = followed;
      setStatus(null);
      setFollowed(!previous);
      const result = await toggleCuratorFollow(curatorHandle);
      if (!result.success) {
        setFollowed(previous);
        setStatus(result.error ?? "팔로우 상태를 저장하지 못했어요.");
        return;
      }
      setFollowed(Boolean(result.followed));
    });
  };

  return (
    <div className="terminal-frame p-4">
      <p className="text-sm font-semibold">가벼운 액션</p>
      <p className="mt-2 text-xs leading-6 text-[var(--terminal-muted)]">
        좋아요, 북마크, 팔로우가 모두 로그인한 사용자 기준으로 실제 저장돼요.
      </p>

      {requiresAuth && (
        <AuthRequiredNotice
          className="mt-4 border border-[var(--terminal-border)] px-3 py-3 text-xs leading-6 text-[var(--terminal-soft)]"
          message="반응을 저장하려면 먼저 로그인해 주세요."
        />
      )}

      <div className="mt-4 grid gap-2">
        {requiresAuth ? (
          <Link href="/auth" className="terminal-button w-full justify-between">
            <span>좋아요</span>
            <span>{likes}</span>
          </Link>
        ) : (
          <button
            type="button"
            className="terminal-button w-full justify-between"
            onClick={handleLike}
            disabled={pending}
          >
            <span>{liked ? "좋아요 취소" : "좋아요"}</span>
            <span>{likes}</span>
          </button>
        )}
        {requiresAuth ? (
          <Link href="/auth" className="terminal-button w-full justify-between">
            <span>북마크</span>
            <span>{bookmarks}</span>
          </Link>
        ) : (
          <button
            type="button"
            className="terminal-button w-full justify-between"
            onClick={handleBookmark}
            disabled={pending}
          >
            <span>{bookmarked ? "북마크 해제" : "북마크"}</span>
            <span>{bookmarks}</span>
          </button>
        )}
        {followRequiresAuth ? (
          <Link href="/auth" className="terminal-button w-full justify-between">
            <span>{curatorName ?? "큐레이터"} 팔로우</span>
            <span>{followers}</span>
          </Link>
        ) : (
          <button
            type="button"
            className="terminal-button w-full justify-between"
            onClick={handleFollow}
            disabled={pending || !curatorHandle}
          >
            <span>{followed ? `${curatorName ?? "큐레이터"} 언팔로우` : `${curatorName ?? "큐레이터"} 팔로우`}</span>
            <span>{followers}</span>
          </button>
        )}
      </div>

      {status && <p className="mt-3 text-xs leading-6 text-[var(--terminal-soft)]">{status}</p>}
    </div>
  );
}
