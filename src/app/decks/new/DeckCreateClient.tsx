"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Card } from "@/lib/cards";
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

type Props = {
  cards: Card[];
};

export default function DeckCreateClient({ cards }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<DeckFormInput>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.title.localeCompare(b.title)),
    [cards]
  );

  const onChange =
    (key: keyof DeckFormInput) =>
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
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>create://deck</span>
            <span>{cards.length.toString().padStart(2, "0")} cards available</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <Link className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]" href="/decks">
                ← return --decks
              </Link>
              <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em]">덱 생성</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                카드들을 하나의 플레이리스트로 묶어요. 선택 UI도 전부 각진 패널 스타일로
                바꿔서 홈 화면과 같은 언어로 보이게 맞췄어요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">required</span>
                  <span>name / cards</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">redirect</span>
                  <span>detail page</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <form onSubmit={onSubmit} className="mt-8 terminal-frame space-y-6 p-5 sm:p-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">덱 이름</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="Classic Miku"
            />
            {errors.includes("name") && (
              <p className="text-xs text-[var(--terminal-error)]">덱 이름을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">설명 (선택)</label>
            <textarea
              value={form.description}
              onChange={onChange("description")}
              className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="덱 소개를 적어줘"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">태그 (콤마로 구분)</label>
            <input
              value={form.tags}
              onChange={onChange("tags")}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              placeholder="classic, miku"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">카드 선택</label>
              <span className="text-xs text-[var(--terminal-muted)]">{form.cards.length}개 선택</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {sortedCards.map((card) => (
                <label
                  key={card.slug}
                  className="flex items-center gap-3 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.cards.includes(card.slug)}
                    onChange={() => toggleCard(card.slug)}
                    className="h-4 w-4 accent-[var(--terminal-accent)]"
                  />
                  <span className="truncate">{card.title}</span>
                </label>
              ))}
            </div>
            {errors.includes("cards") && (
              <p className="text-xs text-[var(--terminal-error)]">카드를 최소 1개 선택해줘.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="terminal-button disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "[ 저장 중... ]" : "[ 덱 만들기 ]"}
            </button>
            <Link className="terminal-button" href="/decks">
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
