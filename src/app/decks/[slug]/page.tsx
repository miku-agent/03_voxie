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
                <Link className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]" href="/decks">
                  ← return --decks
                </Link>
                <Link className="terminal-button text-xs" href={`/decks/${deck.slug}/edit`}>
                  [ edit deck ]
                </Link>
              </div>
              <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] sm:text-4xl">
                {deck.name}
              </h1>
              {deck.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
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
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-4">
          {cards.map((card) => (
            <div key={card?.slug} className="terminal-frame p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                <span>{card?.character}</span>
                <span>{card?.type}</span>
              </div>
              <Link
                className="mt-3 inline-flex text-lg font-semibold uppercase tracking-[0.08em] hover:text-[var(--terminal-fg)]"
                href={`/cards/${card?.slug}`}
              >
                {card?.title}
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
