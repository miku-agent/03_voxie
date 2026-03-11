import Link from "next/link";
import { getDeckBySlugAsync } from "@/lib/decks";
import { getCardBySlugAsync } from "@/lib/cards";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DeckDetailPage({ params }: Props) {
  const { slug } = await params;
  const deck = await getDeckBySlugAsync(slug);

  if (!deck) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="terminal-shell px-6 py-10">
            <p className="text-sm text-[var(--terminal-muted)]">덱을 찾을 수 없어요.</p>
            <Link className="mt-6 inline-flex terminal-button" href="/decks">
              덱 목록으로
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const cards = (await Promise.all(deck.cards.map((cardSlug) => getCardBySlugAsync(cardSlug)))).filter(Boolean);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="text-sm text-[var(--terminal-muted)]" href="/decks">
              ← 덱 목록
            </Link>
            <Link className="terminal-button" href={`/decks/${deck.slug}/edit`}>
              덱 수정
            </Link>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">{deck.name}</h1>
              {deck.description && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)]">
                  {deck.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <span key={tag} className="terminal-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">카드 수</span>
                  <span>{cards.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">태그 수</span>
                  <span>{deck.tags.length}</span>
                </div>
                {deck.featured && (
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">추천 덱</span>
                    <span>예</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <h2 className="text-lg font-semibold">요약</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--terminal-soft)]">
              {deck.shortPitch ?? "이 덱은 관련 카드들을 하나의 맥락으로 묶기 위한 큐레이션 단위예요."}
            </p>

            {deck.curatorNote && (
              <div className="mt-6 border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--terminal-fg)]">큐레이터 메모</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">{deck.curatorNote}</p>
              </div>
            )}
          </article>

          <aside className="terminal-frame p-5">
            <h2 className="text-lg font-semibold">미리 보기</h2>
            <div className="mt-4 space-y-3">
              {cards.slice(0, 3).map((card) => (
                <div key={card?.slug} className="border border-[var(--terminal-border)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--terminal-fg)]">{card?.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--terminal-muted)]">{card?.summary}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">포함된 카드</h2>
            <p className="mt-1 text-sm text-[var(--terminal-muted)]">이 덱에 묶인 카드 목록입니다.</p>
          </div>

          {cards.map((card) => (
            <div key={card?.slug} className="terminal-frame p-5">
              <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
                <span>{card?.character}</span>
                <span>{card?.type}</span>
              </div>
              <Link className="mt-3 inline-flex text-lg font-semibold" href={`/cards/${card?.slug}`}>
                {card?.title}
              </Link>
              {card?.summary && <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">{card.summary}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {card?.tags.map((tag) => (
                  <span key={tag} className="terminal-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
