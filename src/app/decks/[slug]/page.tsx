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
              [ 덱 목록으로 ]
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const cards = (await Promise.all(deck.cards.map((cardSlug) => getCardBySlugAsync(cardSlug)))).filter(Boolean);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>deck://{deck.slug}</span>
            <span>{cards.length.toString().padStart(2, "0")} cards</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]"
                  href="/decks"
                >
                  ← return --decks
                </Link>
                <Link className="terminal-button text-xs" href={`/decks/${deck.slug}/edit`}>
                  [ edit deck ]
                </Link>
              </div>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{deck.name}</h1>
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
                  <span className="text-[var(--terminal-muted)]">cards</span>
                  <span>{cards.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">tags</span>
                  <span>{deck.tags.length}</span>
                </div>
                {deck.featured && (
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">featured</span>
                    <span>yes</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">why this deck exists</p>
            <p className="mt-4 text-sm leading-7 text-[var(--terminal-fg)]">
              {deck.shortPitch ?? "이 덱은 관련 카드들을 하나의 맥락으로 묶기 위한 큐레이션 단위예요."}
            </p>

            {deck.curatorNote && (
              <div className="mt-6 border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">curator note</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-soft)]">{deck.curatorNote}</p>
              </div>
            )}
          </article>

          <aside className="terminal-frame p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">deck preview</p>
            <div className="mt-4 space-y-3">
              {cards.slice(0, 3).map((card) => (
                <div key={card?.slug} className="border border-[var(--terminal-border)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--terminal-fg)]">{card?.title}</p>
                  <p className="mt-1 text-xs leading-6 text-[var(--terminal-muted)]">{card?.summary}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--terminal-muted)]">
              덱은 단순히 카드를 모아두는 박스가 아니라, 시대·감정·프로듀서·무대 맥락을 함께 읽게 해주는 큐레이션 단위예요.
            </p>
          </aside>
        </section>

        <section className="mt-8 grid gap-4">
          {cards.map((card) => (
            <div key={card?.slug} className="terminal-frame p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                <span>{card?.character}</span>
                <span>{card?.type}</span>
              </div>
              <Link className="mt-3 inline-flex text-lg font-semibold hover:text-[var(--terminal-fg)]" href={`/cards/${card?.slug}`}>
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
