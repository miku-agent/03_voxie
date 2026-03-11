import Link from "next/link";
import { listDecks, searchDecks } from "@/lib/decks";
import { getProfileHref } from "@/lib/profiles";

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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="terminal-shell p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">덱</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                카드들을 테마와 맥락으로 묶은 컬렉션 목록입니다.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link className="terminal-button w-full sm:w-auto" href="/decks/new">
                덱 추가
              </Link>
              <Link className="terminal-button w-full sm:w-auto" href="/">
                카드 보기
              </Link>
            </div>
          </div>

          <form action="/decks" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="덱 이름, 설명, 태그 검색"
              className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
            />
            <button type="submit" className="terminal-button w-full sm:min-w-32 sm:w-auto">
              검색
            </button>
          </form>
        </header>

        <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {decks.length === 0 ? (
            <article className="terminal-shell px-6 py-10 md:col-span-2 xl:col-span-3">
              <h2 className="text-xl font-semibold">{query ? "검색된 덱이 없어요" : "아직 덱이 없어요"}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                {query
                  ? "검색어를 조금 줄이거나 다른 키워드로 다시 찾아보세요. 필요하면 새 덱을 바로 만들어 흐름을 정리할 수 있어요."
                  : "첫 덱을 만들면 카드들을 테마별로 묶어서 더 빠르게 둘러볼 수 있어요."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link className="terminal-button w-full sm:w-auto" href="/decks/new">
                  덱 추가
                </Link>
                {query && (
                  <Link className="terminal-button w-full sm:w-auto" href="/decks">
                    검색 초기화
                  </Link>
                )}
              </div>
            </article>
          ) : (
            decks.map((deck) => (
              <article key={deck.slug} className="terminal-frame p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
                  <span>{deck.cards.length} cards</span>
                  <span>{deck.featured ? "featured" : "deck"}</span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold sm:text-lg">
                      <Link href={`/decks/${deck.slug}`}>{deck.name}</Link>
                    </h2>
                    <div className="mt-2 text-xs text-[var(--terminal-muted)]">
                      {deck.authorName && deck.authorHandle ? (
                        <Link href={getProfileHref(deck.authorHandle)!} className="underline-offset-4 hover:underline">
                          by {deck.authorName}
                        </Link>
                      ) : (
                        <span>author unknown</span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--terminal-soft)]">
                      {deck.shortPitch ?? deck.description}
                    </p>
                  </div>
                  <Link href={`/decks/${deck.slug}`} className="shrink-0 text-sm text-[var(--terminal-soft)]">
                    보기 →
                  </Link>
                </div>
                {deck.description && deck.shortPitch && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--terminal-muted)]">{deck.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {deck.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="terminal-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
