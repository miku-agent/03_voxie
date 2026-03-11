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
  const [cardQuery, setCardQuery] = useState("");

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

  const filteredCards = useMemo(() => {
    const query = cardQuery.trim().toLowerCase();
    if (!query) return sortedCards;

    return sortedCards.filter((card) => {
      const haystack = [card.title, card.character, card.producer, ...card.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [cardQuery, sortedCards]);

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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <Link className="text-sm text-[var(--terminal-muted)]" href={`/decks/${deck.slug}`}>
                ← 덱 상세
              </Link>
              <h1 className="mt-4 text-3xl font-semibold">덱 수정</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                이름, 설명, 태그, 포함 카드를 수정할 수 있어요. 저장하면 덱 상세 화면으로 돌아갑니다.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">현재 상태</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">선택 카드</span>
                  <span>{selectedCards.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">태그</span>
                  <span>{tags.length}</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-frame space-y-6 p-5 sm:p-6">
            <section>
              <h2 className="text-lg font-semibold">기본 정보</h2>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">덱 이름</label>
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
                  <label className="text-sm text-[var(--terminal-soft)]">설명</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">태그</h2>
              <p className="mt-1 text-sm text-[var(--terminal-muted)]">관련 태그를 눌러서 덱 맥락을 정리해 주세요.</p>
              <div className="mt-4 flex flex-wrap gap-2">
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
                      className="terminal-chip min-h-11"
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">카드 선택</h2>
                  <p className="mt-1 text-sm text-[var(--terminal-muted)]">포함할 카드를 검색하고 조정할 수 있어요.</p>
                </div>
                <span className="text-sm text-[var(--terminal-soft)]">{selectedCards.length}개 선택</span>
              </div>

              <div className="mt-4 space-y-4">
                <input
                  value={cardQuery}
                  onChange={(event) => setCardQuery(event.target.value)}
                  className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                  placeholder="카드 제목, 캐릭터, 태그 검색"
                />

                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCards.map((card) => (
                    <label
                      key={card.slug}
                      data-active={selectedCards.includes(card.slug)}
                      className="terminal-selectable flex items-start gap-3 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.slug)}
                        onChange={() => toggleCard(card.slug)}
                        className="mt-0.5 h-4 w-4 accent-[var(--terminal-accent)]"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[var(--terminal-fg)]">{card.title}</span>
                        <span className="mt-1 block text-xs text-[var(--terminal-muted)]">
                          {card.character}
                          {card.producer ? ` · ${card.producer}` : ""}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {filteredCards.length === 0 && (
                  <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">
                    검색 결과에 맞는 카드가 없어요. 다른 키워드로 다시 찾거나, 카드 목록을 먼저 늘린 뒤 다시 선택해보세요.
                  </div>
                )}
                {errors.includes("cards") && (
                  <p className="text-xs text-[var(--terminal-error)]">카드를 최소 1개 선택해줘.</p>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-[var(--terminal-border)] pt-6 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="submit"
                className="terminal-button w-full disabled:opacity-50 sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "변경사항 저장"}
              </button>
              <Link className="terminal-button w-full sm:w-auto" href={`/decks/${deck.slug}`}>
                취소
              </Link>
            </div>

            {submitError && <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>}
          </div>

          <aside className="terminal-frame p-5">
            <h2 className="text-lg font-semibold">변경 요약</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">이름</span>
                <span>{name ? "입력됨" : "비어 있음"}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">선택 카드</span>
                <span>{selectedCards.length}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">검색 결과</span>
                <span>{filteredCards.length}</span>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
