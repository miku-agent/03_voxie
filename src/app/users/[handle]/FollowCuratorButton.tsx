"use client";

import { useState } from "react";

type Props = {
  name: string;
  initialFollowers: number;
};

export default function FollowCuratorButton({ name, initialFollowers }: Props) {
  const [followed, setFollowed] = useState(false);
  const followers = initialFollowers + (followed ? 1 : 0);

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <button type="button" className="terminal-button w-full sm:w-auto" onClick={() => setFollowed((value) => !value)}>
        {followed ? `${name} 언팔로우` : `${name} 팔로우`}
      </button>
      <span className="text-sm text-[var(--terminal-muted)]">팔로워 {followers}</span>
    </div>
  );
}
