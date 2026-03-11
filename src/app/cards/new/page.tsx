"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildCardPayload,
  CardFormInput,
  validateCardPayload,
} from "@/lib/card-form";
import { createCard } from "@/lib/actions/cards";

const initialState: CardFormInput = {
  title: "",
  character: "",
  type: "song",
  tags: "",
  sourceUrl: "",
};

export default function CardCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<CardFormInput>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onChange = (key: keyof CardFormInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setSubmitError(null);
    };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildCardPayload(form);
    const missing = validateCardPayload(payload);
    setErrors(missing);

    if (missing.length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await createCard(payload);

        if (result.success) {
          router.push('/');
        } else {
          setSubmitError(result.error || "Failed to create card");
        }
      } catch (error) {
        console.error("Failed to create card:", error);
        setSubmitError("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>create://card</span>
            <span>supabase [write]</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <Link className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]" href="/">
                ← return --cards
              </Link>
              <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em]">
                카드 작성
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                새로운 보컬로이드 순간을 아카이브에 등록해요. 입력 필드도 미쿠 콘솔 톤으로
                정리해서 폼 자체가 한 패널처럼 보이게 맞췄어요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">required</span>
                  <span>title / tags</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">default</span>
                  <span>type:song</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <form onSubmit={onSubmit} className="mt-8 terminal-frame space-y-6 p-5 sm:p-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">제목</label>
            <input
              value={form.title}
              onChange={onChange("title")}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="Melt"
            />
            {errors.includes("title") && (
              <p className="text-xs text-[var(--terminal-error)]">제목을 입력해줘.</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">캐릭터</label>
              <input
                value={form.character}
                onChange={onChange("character")}
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                placeholder="Hatsune Miku"
              />
              {errors.includes("character") && (
                <p className="text-xs text-[var(--terminal-error)]">캐릭터를 입력해줘.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">타입</label>
              <input
                value={form.type}
                onChange={onChange("type")}
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                placeholder="song"
              />
              {errors.includes("type") && (
                <p className="text-xs text-[var(--terminal-error)]">타입을 입력해줘.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">태그 (콤마로 구분)</label>
            <input
              value={form.tags}
              onChange={onChange("tags")}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="classic, romance"
            />
            {errors.includes("tags") && (
              <p className="text-xs text-[var(--terminal-error)]">태그를 하나 이상 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">출처 링크 (선택)</label>
            <input
              value={form.sourceUrl}
              onChange={onChange("sourceUrl")}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="https://mikudb.moe/"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="terminal-button disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "[ 저장 중... ]" : "[ 카드 만들기 ]"}
            </button>
            <Link className="terminal-button" href="/">
              [ 취소 ]
            </Link>
          </div>

          {submitError && (
            <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>
          )}
        </form>
      </main>
    </div>
  );
}
