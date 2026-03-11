import Link from "next/link";
import { listDecks, searchDecks } from "@/lib/decks";

export default async function DeckListPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.q ?? "";
  const allDecks = await listDecks();
  const decks = searchDecks(query, allDecks);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>playlist://decks</span>
            <span>{decks.length.toString().padStart(2, "0")} results</span>
          </div>
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.18em] sm:text-4xl">
              Decks
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
              카드로 묶은 플레이리스트를 미쿠 콘솔 스타일로 탐색해요. 차분한 딥네이비
              배경 위에 블루그린 phosphor 하이라이트를 얹었어요.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="terminal-button" href="/decks/new">
                [ 덱 생성 ]
              </Link>
              <Link className="terminal-button" href="/">
                [ 카드 보기 ]
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>search --decks</span>
            <span>{query || "--all"}</span>
          </div>
          <div className="px-5 py-5 sm:px-6">
            <form action="/decks" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="search --decks"
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              />
              <button type="submit" className="terminal-button sm:min-w-36">
                [ 검색 ]
              </button>
            </form>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {decks.map((deck) => (
            <article key={deck.slug} className="terminal-frame p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                <span>{deck.cards.length} cards</span>
                <span>deck</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold uppercase tracking-[0.08em]">
                <Link className="hover:text-[var(--terminal-fg)]" href={`/decks/${deck.slug}`}>
                  {deck.name}
                </Link>
              </h2>
              {deck.description && (
                <p className="mt-3 text-sm leading-6 text-[var(--terminal-muted)]">
                  {deck.description}
                </p>
              )}
              <div className="mt-3 h-px bg-[var(--terminal-border)]" />
              <div className="mt-4 flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <span key={tag} className="terminal-chip">
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
