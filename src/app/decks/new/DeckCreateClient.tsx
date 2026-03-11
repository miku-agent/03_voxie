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
  const [cardQuery, setCardQuery] = useState("");

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.title.localeCompare(b.title)),
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <Link className="text-sm text-[var(--terminal-muted)]" href="/decks">
                ← 덱 목록
              </Link>
              <h1 className="mt-4 text-3xl font-semibold">덱 추가</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                카드를 하나의 테마로 묶는 덱을 만듭니다. 설명과 태그를 함께 적어두면 탐색성이 더 좋아져요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">입력 가이드</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--terminal-muted)]">
                <li>• 덱 이름과 카드 선택은 필수예요.</li>
                <li>• 설명은 덱의 맥락을 보여줄 때 유용해요.</li>
                <li>• 카드가 많아질수록 검색으로 빠르게 골라요.</li>
              </ul>
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
                    value={form.name}
                    onChange={onChange("name")}
                    className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="예: Classic Miku"
                  />
                  {errors.includes("name") && (
                    <p className="text-xs text-[var(--terminal-error)]">덱 이름을 입력해줘.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">설명</label>
                  <textarea
                    value={form.description}
                    onChange={onChange("description")}
                    className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="이 덱이 어떤 흐름과 분위기를 묶는지 적어주세요"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">태그</label>
                  <input
                    value={form.tags}
                    onChange={onChange("tags")}
                    className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="예: classic, miku, emotional"
                  />
                  <p className="text-xs text-[var(--terminal-muted)]">여러 태그는 쉼표(,)로 구분해 주세요.</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">카드 선택</h2>
                  <p className="mt-1 text-sm text-[var(--terminal-muted)]">덱에 포함할 카드를 골라주세요.</p>
                </div>
                <span className="text-sm text-[var(--terminal-soft)]">{form.cards.length}개 선택</span>
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
                      className="flex items-start gap-3 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.cards.includes(card.slug)}
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
                  <p className="text-sm text-[var(--terminal-muted)]">검색 결과에 맞는 카드가 없어요.</p>
                )}
                {errors.includes("cards") && (
                  <p className="text-xs text-[var(--terminal-error)]">카드를 최소 1개 선택해줘.</p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--terminal-border)] pt-6">
              <button
                type="submit"
                className="terminal-button disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "덱 저장"}
              </button>
              <Link className="terminal-button" href="/decks">
                취소
              </Link>
            </div>

            {submitError && <p className="text-xs text-[var(--terminal-error)]">{submitError}</p>}
          </div>

          <aside className="terminal-frame p-5">
            <h2 className="text-lg font-semibold">현재 상태</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">이름</span>
                <span>{form.name ? "입력됨" : "비어 있음"}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">선택 카드</span>
                <span>{form.cards.length}</span>
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
