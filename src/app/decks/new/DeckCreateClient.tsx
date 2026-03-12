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
import AuthRequiredNotice from "@/components/AuthRequiredNotice";

const initialState: DeckFormInput = {
  name: "",
  tags: "",
  cards: [],
  description: "",
  intro: "",
  curatorNote: "",
};

type Props = {
  cards: Card[];
  requiresAuth: boolean;
};

export default function DeckCreateClient({ cards, requiresAuth }: Props) {
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

  const moveCard = (slug: string, direction: -1 | 1) => {
    setForm((prev) => {
      const index = prev.cards.indexOf(slug);
      if (index === -1) return prev;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.cards.length) return prev;
      const next = [...prev.cards];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return { ...prev, cards: next };
    });
  };

  const selectedCardObjects = form.cards
    .map((slug) => cards.find((card) => card.slug === slug))
    .filter((card): card is Card => Boolean(card));

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
          router.push(`/decks/${result.data.slug}?created=deck`);
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

  if (requiresAuth) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="terminal-shell p-6">
            <Link className="text-sm text-[var(--terminal-muted)]" href="/decks">
              ← 덱 목록
            </Link>
            <h1 className="mt-4 text-2xl font-semibold">덱 추가는 로그인 후에 가능해요</h1>
            <AuthRequiredNotice
              className="mt-4 border border-[var(--terminal-border)] px-4 py-3 text-sm leading-7 text-[var(--terminal-soft)]"
              message="덱 생성은 작성 권한이 필요한 액션입니다."
            />
          </div>
        </main>
      </div>
    );
  }

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
                카드를 하나의 테마로 묶는 덱을 만듭니다. 이번 플로우에서는 순서, 인트로, 큐레이터 메모까지 함께 적어 story-driven deck을 만들 수 있어요.
              </p>
            </div>
            <aside className="terminal-frame p-4">
              <p className="text-sm font-semibold">입력 가이드</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--terminal-muted)]">
                <li>• 덱 이름과 카드 선택은 필수예요.</li>
                <li>• 인트로는 덱 첫 화면에서 읽히는 요약 문단이에요.</li>
                <li>• 선택한 카드는 아래 순서 편집에서 위/아래로 정렬할 수 있어요.</li>
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
                  <label className="text-sm text-[var(--terminal-soft)]">인트로 / 요약</label>
                  <textarea
                    value={form.intro}
                    onChange={onChange("intro")}
                    className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="이 덱을 어떤 순서와 관점으로 읽으면 좋은지 짧게 적어주세요"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--terminal-soft)]">큐레이터 메모</label>
                  <textarea
                    value={form.curatorNote}
                    onChange={onChange("curatorNote")}
                    className="min-h-[120px] w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
                    placeholder="왜 이 카드 구성이 의미 있는지, 어떤 감상 포인트가 있는지 메모해 주세요"
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
                      data-active={form.cards.includes(card.slug)}
                      className="terminal-selectable flex items-start gap-3 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm"
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
                  <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">
                    검색 결과에 맞는 카드가 없어요. 다른 키워드로 다시 찾거나, 먼저 카드를 추가한 뒤 덱으로 묶어보세요.
                  </div>
                )}
                {errors.includes("cards") && (
                  <p className="text-xs text-[var(--terminal-error)]">카드를 최소 1개 선택해줘.</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">순서 편집</h2>
                  <p className="mt-1 text-sm text-[var(--terminal-muted)]">선택한 카드를 위/아래로 옮겨 덱 흐름을 정리해요.</p>
                </div>
                <span className="text-sm text-[var(--terminal-soft)]">{selectedCardObjects.length}개 정렬 중</span>
              </div>

              <div className="mt-4 space-y-3">
                {selectedCardObjects.length > 0 ? (
                  selectedCardObjects.map((card, index) => (
                    <div key={card.slug} className="border border-[var(--terminal-border)] px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs text-[var(--terminal-muted)]">#{String(index + 1).padStart(2, "0")}</p>
                          <p className="mt-1 text-sm font-semibold">{card.title}</p>
                          <p className="mt-1 text-xs text-[var(--terminal-muted)]">{card.character}{card.producer ? ` · ${card.producer}` : ""}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" className="terminal-button px-3 py-2 text-xs" onClick={() => moveCard(card.slug, -1)} disabled={index === 0}>↑</button>
                          <button type="button" className="terminal-button px-3 py-2 text-xs" onClick={() => moveCard(card.slug, 1)} disabled={index === selectedCardObjects.length - 1}>↓</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-[var(--terminal-border)] px-4 py-4 text-sm text-[var(--terminal-muted)]">
                    먼저 카드를 선택하면 여기서 덱 순서를 조정할 수 있어요.
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-[var(--terminal-border)] pt-6 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="submit"
                className="terminal-button w-full disabled:opacity-50 sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "덱 저장"}
              </button>
              <Link className="terminal-button w-full sm:w-auto" href="/decks">
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
                <span className="text-[var(--terminal-muted)]">인트로</span>
                <span>{form.intro ? "입력됨" : "비어 있음"}</span>
              </div>
              <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                <span className="text-[var(--terminal-muted)]">큐레이터 메모</span>
                <span>{form.curatorNote ? "입력됨" : "비어 있음"}</span>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
