import Link from "next/link";
import { filterCards, listCards, listTags, searchCards } from "@/lib/cards";
import { listDecks } from "@/lib/decks";

type Props = {
  searchParams?: Promise<{ tag?: string; q?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const tag = resolvedSearchParams.tag;
  const query = resolvedSearchParams.q ?? "";
  const allCards = await listCards();
  const allDecks = await listDecks();
  const searchedCards = searchCards(query, allCards);
  const cards = filterCards(tag, allCards).filter((card) =>
    searchedCards.some((matched) => matched.slug === card.slug)
  );
  const tags = listTags(allCards);
  const featuredDecks = allDecks.filter((deck) => deck.featured).slice(0, 3);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold sm:text-3xl">카드 아카이브</h1>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  곡, 장면, 감정선을 카드로 남기고 덱으로 묶어 정리합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="terminal-button" href="/cards/new">
                  카드 추가
                </Link>
                <Link className="terminal-button" href="/decks/new">
                  덱 추가
                </Link>
              </div>
            </div>

            <form action="/" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="곡, 캐릭터, 프로듀서 검색"
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              />
              <button type="submit" className="terminal-button sm:min-w-32">
                검색
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
                data-testid="tag-all"
                data-active={!tag}
                className="terminal-chip"
              >
                전체
              </Link>
              {tags.map((item) => (
                <Link
                  key={item}
                  href={`/?tag=${item}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  data-testid={`tag-${item}`}
                  data-active={tag === item}
                  className="terminal-chip"
                >
                  #{item}
                </Link>
              ))}
            </div>
          </div>

          <aside className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">카드</p>
              <p className="mt-2 text-2xl font-semibold">{allCards.length}</p>
            </div>
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">덱</p>
              <p className="mt-2 text-2xl font-semibold">{allDecks.length}</p>
            </div>
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">태그</p>
              <p className="mt-2 text-2xl font-semibold">{tags.length}</p>
            </div>
          </aside>
        </section>

        {featuredDecks.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">추천 덱</h2>
                <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                  지금 바로 둘러볼 수 있는 큐레이션 묶음
                </p>
              </div>
              <Link className="text-sm text-[var(--terminal-soft)]" href="/decks">
                전체 덱 보기 →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredDecks.map((deck) => (
                <Link key={deck.slug} href={`/decks/${deck.slug}`} className="terminal-frame block p-5">
                  <div className="flex items-center justify-between gap-4 text-xs text-[var(--terminal-muted)]">
                    <span>{deck.name}</span>
                    <span>{deck.cards.length} cards</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--terminal-soft)]">
                    {deck.shortPitch ?? deck.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {deck.tags.slice(0, 3).map((item) => (
                      <span key={item} className="terminal-chip">
                        #{item}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="cards" className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">카드</h2>
              <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                {query || tag ? "필터 결과" : "최근 카드와 대표 카드 목록"}
              </p>
            </div>
            <Link className="text-sm text-[var(--terminal-soft)]" href="/cards/new">
              카드 추가 →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.length === 0 ? (
              <article className="terminal-shell px-6 py-10 md:col-span-2 xl:col-span-3">
                <h2 className="text-xl font-semibold">검색 결과가 없어요</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                  다른 태그를 선택하거나 검색어를 줄여보세요. 필요하면 새 카드를 추가해 아카이브를 채울 수 있어요.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className="terminal-button" href={tag ? "/" : "/cards/new"}>
                    {tag ? "필터 초기화" : "카드 추가"}
                  </Link>
                </div>
              </article>
            ) : (
              cards.map((card) => (
                <article key={card.slug} data-testid="card" className="terminal-frame p-5">
                  <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
                    <span>{card.character}</span>
                    <span>{card.type}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">
                    <Link href={`/cards/${card.slug}`}>{card.title}</Link>
                  </h3>
                  {card.summary && (
                    <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">{card.summary}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--terminal-muted)]">
                    {card.producer && <span>{card.producer}</span>}
                    {card.year && <span>{card.year}</span>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.tags.map((item) => (
                      <span key={item} className="terminal-chip">
                        #{item}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
