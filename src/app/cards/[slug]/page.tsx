import Link from "next/link";
import { getCardBySlugAsync, getCardExternalLinks } from "@/lib/cards";
import { listDecks } from "@/lib/decks";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CardDetail({ params }: Props) {
  const { slug } = await params;
  const card = await getCardBySlugAsync(slug);

  if (!card) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="terminal-shell px-6 py-10">
            <p className="text-sm text-[var(--terminal-muted)]">카드를 찾을 수 없어요.</p>
            <Link className="mt-6 inline-flex terminal-button" href="/">
              [ 목록으로 ]
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const links = getCardExternalLinks(card);
  const decks = await listDecks();
  const relatedDecks = decks.filter((deck) => deck.cards.includes(card.slug));

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>card://{card.slug}</span>
            <span>{card.type.toUpperCase()}</span>
          </div>
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <Link
                className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)] hover:text-[var(--terminal-fg)]"
                href="/"
              >
                ← return --cards
              </Link>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{card.title}</h1>
              {card.summary && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)] sm:text-base">
                  {card.summary}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span key={item} className="terminal-chip">
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="terminal-frame p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">character</span>
                  <span>{card.character}</span>
                </div>
                {card.producer && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">producer</span>
                    <span className="text-right">{card.producer}</span>
                  </div>
                )}
                {card.year && (
                  <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">year</span>
                    <span>{card.year}</span>
                  </div>
                )}
                {card.era && (
                  <div className="flex items-center justify-between gap-4 border border-[var(--terminal-border)] px-3 py-2">
                    <span className="text-[var(--terminal-muted)]">era</span>
                    <span className="text-right">{card.era}</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="terminal-frame p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">archive note</p>
            {card.description ? (
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--terminal-soft)]">
                {card.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--terminal-muted)]">아직 등록된 설명이 없어요.</p>
            )}

            {card.whyItMatters && (
              <div className="mt-6 border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">why this card matters</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-fg)]">{card.whyItMatters}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">mood / usage</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(card.mood ?? card.tags).map((item) => (
                  <span key={item} className="terminal-chip" data-active="true">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <section className="terminal-frame p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">signal preview</p>
              <div className="mt-4 flex aspect-[4/3] items-end border border-[var(--terminal-border)] bg-[radial-gradient(circle_at_top,rgba(57,197,187,0.28)_0%,rgba(8,17,29,0.95)_55%,rgba(3,5,13,1)_100%)] p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-soft)]">{card.character}</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--terminal-fg)]">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">{card.summary}</p>
                </div>
              </div>
            </section>

            <section className="terminal-frame p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">listen / reference</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {links.source && (
                  <a href={links.source} target="_blank" rel="noreferrer" className="terminal-button text-center">
                    [ reference source ]
                  </a>
                )}
                <a href={links.youtubeSearch} target="_blank" rel="noreferrer" className="terminal-button text-center">
                  [ search on youtube ]
                </a>
                <a href={links.niconicoSearch} target="_blank" rel="noreferrer" className="terminal-button text-center">
                  [ search on niconico ]
                </a>
              </div>
            </section>

            <section className="terminal-frame p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">included in decks</p>
                <Link href="/decks" className="text-xs text-[var(--terminal-fg)]">
                  모든 덱 보기 →
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {relatedDecks.length > 0 ? (
                  relatedDecks.map((deck) => (
                    <Link key={deck.slug} href={`/decks/${deck.slug}`} className="block border border-[var(--terminal-border)] px-4 py-4">
                      <p className="text-sm font-semibold">{deck.name}</p>
                      <p className="mt-1 text-xs leading-6 text-[var(--terminal-muted)]">
                        {deck.shortPitch ?? deck.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[var(--terminal-muted)]">아직 이 카드를 담은 덱이 없어요.</p>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
