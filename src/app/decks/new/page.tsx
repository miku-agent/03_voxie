"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cards } from "@/lib/cards";
import {
  buildDeckPayload,
  DeckFormInput,
  validateDeckPayload,
} from "@/lib/deck-form";
import { createDeck } from "@/lib/actions/decks";

const initialState: DeckFormInput = {
  name: "",
  tags: "",
  cards: [],
  description: "",
};

export default function DeckCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<DeckFormInput>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const onChange = (key: keyof DeckFormInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setSubmitError(null);
    };

  const toggleCard = (slug: string) => {
    setForm((prev) => {
      const exists = prev.cards.includes(slug);
      return {
        ...prev,
        cards: exists
          ? prev.cards.filter((item) => item !== slug)
          : [...prev.cards, slug],
      };
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildDeckPayload(form);
    const missing = validateDeckPayload(payload);
    setErrors(missing);

    if (missing.length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await createDeck(payload);

        if (result.success && result.data) {
          router.push(`/decks/${result.data.slug}`);
        } else {
          setSubmitError(result.error || "Failed to create deck");
        }
      } catch (error) {
        console.error("Failed to create deck:", error);
        setSubmitError("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link className="text-sm text-[var(--terminal-fg)]" href="/decks">
          ← 덱 목록으로
        </Link>

        <h1 className="mt-6 text-2xl font-semibold">덱 생성</h1>
        <p className="mt-2 text-sm text-[var(--terminal-muted)]">
          덱을 저장하면 바로 상세 페이지로 이동해요.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">덱 이름</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="Classic Miku"
            />
            {errors.includes("name") && (
              <p className="text-xs text-[var(--terminal-error)]">덱 이름을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">설명 (선택)</label>
            <textarea
              value={form.description}
              onChange={onChange("description")}
              className="min-h-[96px] w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="덱 소개를 적어줘"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">태그 (콤마로 구분)</label>
            <input
              value={form.tags}
              onChange={onChange("tags")}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
              placeholder="classic, miku"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--terminal-muted)]">카드 선택</label>
              <span className="text-xs text-[var(--terminal-muted)]">
                {form.cards.length}개 선택
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {sortedCards.map((card) => (
                <label
                  key={card.slug}
                  className="flex items-center gap-3 rounded border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.cards.includes(card.slug)}
                    onChange={() => toggleCard(card.slug)}
                    className="h-3 w-3 accent-emerald-400"
                  />
                  <span>{card.title}</span>
                </label>
              ))}
            </div>
            {errors.includes("cards") && (
              <p className="text-xs text-[var(--terminal-error)]">카드를 최소 1개 선택해줘.</p>
            )}
          </div>

          <button
            type="submit"
            className="terminal-button disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "[ 저장 중... ]" : "[ 덱 만들기 ]"}
          </button>

          {submitError && (
            <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>
          )}
        </form>
      </main>
    </div>
  );
}
