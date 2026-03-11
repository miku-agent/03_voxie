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
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link className="text-sm text-[var(--terminal-fg)]" href="/">
          ← 목록으로
        </Link>

        <h1 className="mt-6 text-2xl font-semibold">카드 작성</h1>
        <p className="mt-2 text-sm text-[var(--terminal-muted)]">
          MVP에서는 저장 대신 유효성만 확인해요.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">제목</label>
            <input
              value={form.title}
              onChange={onChange("title")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="Melt"
            />
            {errors.includes("title") && (
              <p className="text-xs text-[var(--terminal-error)]">제목을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">캐릭터</label>
            <input
              value={form.character}
              onChange={onChange("character")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="Hatsune Miku"
            />
            {errors.includes("character") && (
              <p className="text-xs text-[var(--terminal-error)]">캐릭터를 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">타입</label>
            <input
              value={form.type}
              onChange={onChange("type")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="song"
            />
            {errors.includes("type") && (
              <p className="text-xs text-[var(--terminal-error)]">타입을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">태그 (콤마로 구분)</label>
            <input
              value={form.tags}
              onChange={onChange("tags")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="classic, romance"
            />
            {errors.includes("tags") && (
              <p className="text-xs text-[var(--terminal-error)]">태그를 하나 이상 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">출처 링크 (선택)</label>
            <input
              value={form.sourceUrl}
              onChange={onChange("sourceUrl")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="https://mikudb.moe/"
            />
          </div>

          <button
            type="submit"
            className="terminal-button disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "[ 저장 중... ]" : "[ 카드 만들기 ]"}
          </button>

          {submitError && (
            <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>
          )}
        </form>
      </main>
    </div>
  );
}
