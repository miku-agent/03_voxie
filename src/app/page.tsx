import Link from "next/link";
import { filterCards, listCards, listTags, searchCards } from "@/lib/cards";
import { listDecks } from "@/lib/decks";

type Props = {
  searchParams?: Promise<{ tag?: string; q?: string; created?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const tag = resolvedSearchParams.tag;
  const query = resolvedSearchParams.q ?? "";
  const created = resolvedSearchParams.created;
  const allCards = await listCards();
  const allDecks = await listDecks();
  const searchedCards = searchCards(query, allCards);
  const cards = filterCards(tag, allCards).filter((card) =>
    searchedCards.some((matched) => matched.slug === card.slug)
  );
  const tags = listTags(allCards);
  const featuredDecks = allDecks.filter((deck) => deck.featured).slice(0, 3);
  const hasFilters = Boolean(query || tag);
  const resultLabel = hasFilters
    ? `검색/필터 결과 ${cards.length}개`
    : `전체 카드 ${cards.length}개`;

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                  Voxie archive
                </p>
                <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">카드 아카이브</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                  곡, 장면, 감정선을 카드로 남기고 덱으로 묶어 정리합니다. 빠르게 추가하고, 나중에 큐레이션처럼 다시 엮을 수 있어요.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                <Link className="terminal-button w-full sm:w-auto" href="/cards/new">
                  카드 추가
                </Link>
                <Link className="terminal-button w-full sm:w-auto" href="/decks/new">
                  덱 추가
                </Link>
              </div>
            </div>

            {created === "card" && (
              <div className="terminal-notice mt-5">
                카드가 저장됐어요. 이제 태그를 고르거나 검색해서 바로 위치를 확인할 수 있어요.
              </div>
            )}

            <form action="/" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="곡, 캐릭터, 프로듀서 검색"
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              />
              <button type="submit" className="terminal-button w-full sm:min-w-32 sm:w-auto">
                검색
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--terminal-muted)]">
              <span>{resultLabel}</span>
              {query && <span>· 검색어: “{query}”</span>}
              {tag && <span>· 태그: #{tag}</span>}
              {hasFilters && (
                <Link href="/" className="text-[var(--terminal-soft)] underline-offset-4 hover:underline">
                  초기화
                </Link>
              )}
            </div>

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

          <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredDecks.map((deck) => (
                <Link key={deck.slug} href={`/decks/${deck.slug}`} className="terminal-frame block p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4 text-xs text-[var(--terminal-muted)]">
                    <span className="truncate">{deck.name}</span>
                    <span>{deck.cards.length} cards</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--terminal-soft)]">
                    {deck.shortPitch ?? deck.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
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

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {cards.length === 0 ? (
              <article className="terminal-shell px-6 py-10 md:col-span-2 xl:col-span-3">
                <h2 className="text-xl font-semibold">검색 결과가 없어요</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                  다른 태그를 선택하거나 검색어를 줄여보세요. 필요하면 새 카드를 추가해 아카이브를 채울 수 있어요.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link className="terminal-button w-full sm:w-auto" href="/">
                    필터 초기화
                  </Link>
                  <Link className="terminal-button w-full sm:w-auto" href="/cards/new">
                    카드 추가
                  </Link>
                </div>
              </article>
            ) : (
              cards.map((card) => (
                <article key={card.slug} data-testid="card" className="terminal-frame p-4">
                  <div className="flex items-start justify-between gap-4 text-xs text-[var(--terminal-muted)]">
                    <span className="truncate">{card.character}</span>
                    <span className="shrink-0 uppercase">{card.type}</span>
                  </div>
                  <div className="mt-3 min-w-0">
                    <h3 className="truncate text-base font-semibold sm:text-lg">
                      <Link href={`/cards/${card.slug}`}>{card.title}</Link>
                    </h3>
                    {card.summary && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--terminal-soft)]">
                        {card.summary}
                      </p>
                    )}
                  </div>
                  <div className="dense-meta mt-3">
                    {card.producer && <span>{card.producer}</span>}
                    {card.year && <span>{card.year}</span>}
                    <span>{card.tags.length} tags</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {card.tags.slice(0, 4).map((item) => (
                      <span key={item} className="terminal-chip">
                        #{item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--terminal-border)] pt-3 text-sm">
                    <span className="text-[var(--terminal-muted)]">상세 정보 보기</span>
                    <Link href={`/cards/${card.slug}`} className="text-[var(--terminal-soft)]">
                      열기 →
                    </Link>
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
