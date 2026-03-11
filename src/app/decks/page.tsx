import Link from "next/link";
import { searchDecks } from "@/lib/decks";

export default function DeckListPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";
  const decks = searchDecks(query);
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">덱</h1>
          <p className="mt-2 text-sm text-[var(--terminal-muted)]">
            카드로 묶은 플레이리스트
          </p>
          <div className="mt-4">
            <Link className="text-[var(--terminal-fg)]" href="/decks/new">
              덱 생성 →
            </Link>
          </div>
        </header>

        <section className="mb-6">
          <form action="/decks" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="search --decks"
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm text-[var(--terminal-fg)]"
            />
            <button type="submit" className="terminal-button">
              [ 검색 ]
            </button>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {decks.map((deck) => (
            <article
              key={deck.slug}
              className="terminal-frame p-5"
            >
              <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
                <span>{deck.cards.length} cards</span>
                <span className="uppercase">deck</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">
                <Link className="hover:text-[var(--terminal-fg)]" href={`/decks/${deck.slug}`}>
                  {deck.name}
                </Link>
              </h2>
              {deck.description && (
                <p className="mt-2 text-sm text-[var(--terminal-muted)]">
                  {deck.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--terminal-border)] px-2 py-0.5 text-[10px] text-[var(--terminal-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
