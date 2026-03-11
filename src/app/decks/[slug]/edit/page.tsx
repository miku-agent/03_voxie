"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cards as allCards } from "@/lib/cards";
import { getDeckBySlug } from "@/lib/decks";
import {
  buildDeckUpdatePayload,
  validateDeckUpdatePayload,
} from "@/lib/deck-edit";

export default function DeckEditPage({ params }: { params: { slug: string } }) {
  const deck = getDeckBySlug(params.slug);

  const [name, setName] = useState(deck?.name ?? "");
  const [description, setDescription] = useState(deck?.description ?? "");
  const [tags, setTags] = useState(deck?.tags ?? []);
  const [selectedCards, setSelectedCards] = useState(deck?.cards ?? []);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const sortedCards = useMemo(
    () => [...allCards].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  if (!deck) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm text-[var(--terminal-muted)]">덱을 찾을 수 없어요.</p>
          <Link className="mt-6 inline-flex text-[var(--terminal-fg)]" href="/decks">
            ← 덱 목록으로
          </Link>
        </main>
      </div>
    );
  }

  const toggleCard = (slug: string) => {
    setSelectedCards((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildDeckUpdatePayload({
      name,
      description,
      tags,
      cards: selectedCards,
    });
    const nextErrors = validateDeckUpdatePayload(payload);
    setErrors(nextErrors);
    setSaved(nextErrors.length === 0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <Link className="text-sm text-[var(--terminal-fg)]" href={`/decks/${deck.slug}`}>
            ← 덱 상세로
          </Link>
          <span className="text-xs text-[var(--terminal-muted)]">EDIT MODE</span>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 terminal-frame p-6">
          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">덱 이름</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm text-[var(--terminal-fg)]"
            />
            {errors.includes("name") && (
              <p className="text-xs text-[var(--terminal-error)]">덱 이름을 입력해줘.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">설명</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[96px] w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm text-[var(--terminal-fg)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--terminal-muted)]">태그</label>
            <div className="flex flex-wrap gap-2">
              {allCards.flatMap((card) => card.tags).filter((tag, index, arr) => arr.indexOf(tag) === index).sort().map((tag) => {
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
                    className={`border px-2 py-1 text-xs ${
                      active
                        ? "border-[var(--terminal-fg)] text-[var(--terminal-fg)]"
                        : "border-[var(--terminal-border)] text-[var(--terminal-muted)]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--terminal-muted)]">카드 선택</label>
              <span className="text-xs text-[var(--terminal-muted)]">{selectedCards.length}개 선택</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {sortedCards.map((card) => (
                <label
                  key={card.slug}
                  className="flex items-center gap-3 border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(card.slug)}
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

          <button type="submit" className="terminal-button">
            [ 저장 시뮬레이션 ]
          </button>

          {saved && (
            <p className="text-xs text-[var(--terminal-fg)]">덱 편집 입력 값이 유효해요!</p>
          )}
        </form>
      </main>
    </div>
  );
}
