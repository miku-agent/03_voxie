"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Card } from "@/lib/cards";
import type { Deck } from "@/lib/decks";
import {
  buildDeckUpdatePayload,
  validateDeckUpdatePayload,
} from "@/lib/deck-edit";
import { updateDeck } from "@/lib/actions/decks";

type Props = {
  deck: Deck;
  cards: Card[];
};

export default function DeckEditClient({ deck, cards }: Props) {
  const router = useRouter();

  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description ?? "");
  const [tags, setTags] = useState(deck.tags);
  const [selectedCards, setSelectedCards] = useState(deck.cards);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.title.localeCompare(b.title)),
    [cards]
  );

  const availableTags = useMemo(
    () =>
      [...new Set(cards.flatMap((card) => card.tags))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [cards]
  );

  const toggleCard = (slug: string) => {
    setSelectedCards((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const input = {
      name,
      description,
      tags,
      cards: selectedCards,
    };
    const payload = buildDeckUpdatePayload(input);
    const nextErrors = validateDeckUpdatePayload(payload);
    setErrors(nextErrors);

    if (nextErrors.length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await updateDeck(deck.slug, input);

        if (result.success) {
          router.push(`/decks/${deck.slug}`);
        } else {
          setSubmitError(result.error || "Failed to update deck");
        }
      } catch (error) {
        console.error("Failed to update deck:", error);
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
            <span>edit://deck/{deck.slug}</span>
            <span>edit mode</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <Link className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]" href={`/decks/${deck.slug}`}>
                ← return --detail
              </Link>
              <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em]">
                덱 편집
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                변경사항을 저장하면 덱 상세 페이지로 돌아가요. 태그 토글과 카드 선택 UI도
                같은 미쿠 콘솔 언어로 정리했어요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">selected</span>
                  <span>{selectedCards.length} cards</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">tags</span>
                  <span>{tags.length}</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <form onSubmit={onSubmit} className="mt-8 terminal-frame space-y-6 p-5 sm:p-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">덱 이름</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
            />
            {errors.includes("name") && (
              <p className="text-xs text-[var(--terminal-error)]">덱 이름을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">설명</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">태그</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((prev) =>
                        active ? prev.filter((item) => item !== tag) : [...prev, tag]
                      )
                    }
                    data-active={active}
                    className="terminal-chip"
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">카드 선택</label>
              <span className="text-xs text-[var(--terminal-muted)]">{selectedCards.length}개 선택</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {sortedCards.map((card) => (
                <label
                  key={card.slug}
                  className="flex items-center gap-3 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(card.slug)}
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
              {isSubmitting ? "[ 저장 중... ]" : "[ 변경사항 저장 ]"}
            </button>
            <Link className="terminal-button" href={`/decks/${deck.slug}`}>
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
