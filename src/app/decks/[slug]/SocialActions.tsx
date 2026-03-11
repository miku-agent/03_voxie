"use client";

import { useMemo, useState } from "react";

type Props = {
  initialLikes: number;
  initialBookmarks: number;
  curatorName?: string;
  initialFollowers: number;
};

export default function SocialActions({ initialLikes, initialBookmarks, curatorName, initialFollowers }: Props) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [followed, setFollowed] = useState(false);

  const likes = useMemo(() => initialLikes + (liked ? 1 : 0), [initialLikes, liked]);
  const bookmarks = useMemo(() => initialBookmarks + (bookmarked ? 1 : 0), [initialBookmarks, bookmarked]);
  const followers = useMemo(() => initialFollowers + (followed ? 1 : 0), [initialFollowers, followed]);

  return (
    <div className="terminal-frame p-4">
      <p className="text-sm font-semibold">가벼운 액션</p>
      <p className="mt-2 text-xs leading-6 text-[var(--terminal-muted)]">좋아요, 북마크, 큐레이터 팔로우만 먼저 넣어서 반응은 남기되 시끄러운 커뮤니티 기능은 아직 열지 않았어요.</p>
      <div className="mt-4 grid gap-2">
        <button type="button" className="terminal-button w-full justify-between" onClick={() => setLiked((value) => !value)}>
          <span>{liked ? "좋아요 취소" : "좋아요"}</span>
          <span>{likes}</span>
        </button>
        <button type="button" className="terminal-button w-full justify-between" onClick={() => setBookmarked((value) => !value)}>
          <span>{bookmarked ? "북마크 해제" : "북마크"}</span>
          <span>{bookmarks}</span>
        </button>
        <button type="button" className="terminal-button w-full justify-between" onClick={() => setFollowed((value) => !value)}>
          <span>{followed ? `${curatorName ?? "큐레이터"} 언팔로우` : `${curatorName ?? "큐레이터"} 팔로우`}</span>
          <span>{followers}</span>
        </button>
      </div>
    </div>
  );
}
