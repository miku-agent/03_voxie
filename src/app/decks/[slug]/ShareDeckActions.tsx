"use client";

import { useState } from "react";

type Props = {
  title: string;
  url: string;
};

export default function ShareDeckActions({ title, url }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  const shareLink = async () => {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} 덱을 공유해요`,
          url,
        });
        setStatus("shared");
        return;
      } catch {
        // fall through to copy flow if native share is cancelled/unavailable
      }
    }

    await copyLink();
  };

  return (
    <div className="terminal-frame p-4">
      <p className="text-sm font-semibold">공유</p>
      <p className="mt-2 break-all text-xs leading-6 text-[var(--terminal-muted)]">{url}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button type="button" className="terminal-button w-full sm:w-auto" onClick={shareLink}>
          공유하기
        </button>
        <button type="button" className="terminal-button w-full sm:w-auto" onClick={copyLink}>
          링크 복사
        </button>
      </div>
      {status === "copied" && <p className="mt-3 text-xs text-[var(--terminal-soft)]">링크를 복사했어요.</p>}
      {status === "shared" && <p className="mt-3 text-xs text-[var(--terminal-soft)]">공유 창을 열었어요.</p>}
      {status === "error" && <p className="mt-3 text-xs text-[var(--terminal-error)]">링크를 복사하지 못했어요.</p>}
    </div>
  );
}
