import Link from "next/link";
import { filterCards, listCards, listTags, searchCards } from "@/lib/cards";
import { listDecks, searchDecks } from "@/lib/decks";
import {
  buildCuratorDiscoveryLinks,
  buildEraDiscoveryLinks,
  buildThemeDiscoveryLinks,
} from "@/lib/home";
import { getProfileHref } from "@/lib/profiles";

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
  const searchedDecks = searchDecks(query, allDecks);
  const cards = filterCards(tag, allCards).filter((card) =>
    searchedCards.some((matched) => matched.slug === card.slug)
  );
  const tags = listTags(allCards);
  const featuredDecks = allDecks.filter((deck) => deck.featured).slice(0, 3);
  const highlightedDecks = (query ? searchedDecks : allDecks).slice(0, 6);
  const themeLinks = buildThemeDiscoveryLinks(allDecks);
  const eraLinks = buildEraDiscoveryLinks(allCards);
  const curatorLinks = buildCuratorDiscoveryLinks(allDecks);
  const hasFilters = Boolean(query || tag);
  const resultLabel = hasFilters
    ? `검색/필터 결과 카드 ${cards.length}개`
    : `전체 카드 ${cards.length}개`;

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                  Voxie curator platform
                </p>
                <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">덱이 중심인 보컬로이드 큐레이션</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                  Voxie의 기본 단위는 카드가 아니라 덱이에요. 곡, 장면, 감정선을 카드로 수집하고, 그것을 덱으로 엮어 큐레이터의 해석과 흐름을 공유합니다.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                <Link className="terminal-button w-full sm:w-auto" href="/decks">
                  덱 둘러보기
                </Link>
                <Link className="terminal-button w-full sm:w-auto" href="/decks/new">
                  덱 만들기
                </Link>
              </div>
            </div>

            {created === "card" && (
              <div className="terminal-notice mt-5">
                카드가 저장됐어요. 이제 덱 안에 배치해서 하나의 흐름으로 엮어볼 수 있어요.
              </div>
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">P0 thesis</p>
                <p className="mt-2 text-sm font-semibold">deck-first</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">공유와 재방문을 만드는 핵심 단위는 카드보다 덱입니다.</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">user layer</p>
                <p className="mt-2 text-sm font-semibold">curator identity</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">작성자 프로필과 덱 해석이 Voxie의 차별점이 됩니다.</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-xs text-[var(--terminal-muted)]">content loop</p>
                <p className="mt-2 text-sm font-semibold">archive → deck → share</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">카드 수집은 입력 단계이고, 덱 공유가 실제 성장 루프예요.</p>
              </div>
            </div>
          </div>

          <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">덱</p>
              <p className="mt-2 text-2xl font-semibold">{allDecks.length}</p>
            </div>
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">카드</p>
              <p className="mt-2 text-2xl font-semibold">{allCards.length}</p>
            </div>
            <div className="terminal-frame p-4">
              <p className="text-xs text-[var(--terminal-muted)]">태그</p>
              <p className="mt-2 text-2xl font-semibold">{tags.length}</p>
            </div>
          </aside>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">지금 봐야 할 덱</h2>
              <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                새로 온 사용자도 덱이 제품의 중심이라는 걸 바로 이해할 수 있는 진입점이에요.
              </p>
            </div>
            <Link className="text-sm text-[var(--terminal-soft)]" href="/decks">
              전체 덱 보기 →
            </Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            {(highlightedDecks.length > 0 ? highlightedDecks : featuredDecks).slice(0, 1).map((deck) => (
              <Link key={deck.slug} href={`/decks/${deck.slug}`} className="terminal-shell block p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-[var(--terminal-muted)]">
                  <span className="truncate">featured deck</span>
                  <span>{deck.cards.length} cards</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">{deck.name}</h3>
                <div className="mt-3 text-xs text-[var(--terminal-muted)]">
                  {deck.authorName && deck.authorHandle ? (
                    <Link href={getProfileHref(deck.authorHandle)!} className="underline-offset-4 hover:underline">
                      by {deck.authorName}
                    </Link>
                  ) : (
                    <span>author unknown</span>
                  )}
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--terminal-soft)]">
                  {deck.shortPitch ?? deck.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {deck.tags.slice(0, 4).map((item) => (
                    <span key={item} className="terminal-chip">
                      #{item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex text-sm text-[var(--terminal-soft)]">이 덱으로 들어가기 →</div>
              </Link>
            ))}

            <div className="grid gap-3">
              {(highlightedDecks.length > 0 ? highlightedDecks : featuredDecks).slice(1, 3).map((deck) => (
                <Link key={deck.slug} href={`/decks/${deck.slug}`} className="terminal-frame block p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4 text-xs text-[var(--terminal-muted)]">
                    <span className="truncate">{deck.featured ? "featured deck" : "curated deck"}</span>
                    <span>{deck.cards.length} cards</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{deck.name}</h3>
                  <div className="mt-2 text-xs text-[var(--terminal-muted)]">
                    {deck.authorName && deck.authorHandle ? (
                      <Link href={getProfileHref(deck.authorHandle)!} className="underline-offset-4 hover:underline">
                        by {deck.authorName}
                      </Link>
                    ) : (
                      <span>author unknown</span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--terminal-soft)]">
                    {deck.shortPitch ?? deck.description}
                  </p>
                </Link>
              ))}
            </div>

            <aside className="terminal-frame p-5">
              <h3 className="text-base font-semibold">탐색 시작점</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">themes</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {themeLinks.map((item) => (
                      <Link key={item.href} href={item.href} className="terminal-chip">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">eras</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {eraLinks.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                        <span>{item.label}</span>
                        <span className="text-[var(--terminal-muted)]">{item.helper}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--terminal-muted)]">curators</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {curatorLinks.map((item) => (
                      <Link key={item.href} href={item.href} className="border border-[var(--terminal-border)] px-3 py-2">
                        <p className="font-semibold">{item.label}</p>
                        {item.helper && <p className="mt-1 text-xs leading-5 text-[var(--terminal-muted)]">{item.helper}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="terminal-frame p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">큐레이터 레이어</h2>
                <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                  지금 Voxie가 우선 투자할 축을 한 번에 볼 수 있게 정리했어요.
                </p>
              </div>
              <Link className="text-sm text-[var(--terminal-soft)]" href="/users/bini59">
                프로필 보기 →
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold">P0</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">deck UX, curator identity, YouTube embed/share</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold">P1</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">related discovery, onboarding seed decks, lightweight social actions</p>
              </div>
              <div className="border border-[var(--terminal-border)] px-4 py-4">
                <p className="text-sm font-semibold">not now</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">algorithms, heavy moderation, generic archive scale-up without curator loop</p>
              </div>
            </div>
          </div>

          <aside className="terminal-frame p-4">
            <p className="text-sm font-semibold">카드 탐색</p>
            <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
              카드는 여전히 중요하지만, 첫 화면의 주인공은 아니에요. 필요한 순간에 탐색할 수 있도록 유지합니다.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link className="terminal-button w-full" href="#cards">
                카드 탐색으로 이동
              </Link>
              <Link className="terminal-button w-full" href="/cards/new">
                카드 추가
              </Link>
            </div>
          </aside>
        </section>

        <section id="cards" className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">카드 아카이브</h2>
              <p className="mt-1 text-sm text-[var(--terminal-muted)]">
                {query || tag ? "필터 결과" : "덱을 만들기 위한 재료가 되는 카드 목록"}
              </p>
            </div>
            <Link className="text-sm text-[var(--terminal-soft)]" href="/cards/new">
              카드 추가 →
            </Link>
          </div>

          <form action="/" className="mb-4 flex flex-col gap-3 sm:flex-row">
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

          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--terminal-muted)]">
            <span>{resultLabel}</span>
            {query && <span>· 검색어: “{query}”</span>}
            {tag && <span>· 태그: #{tag}</span>}
            {hasFilters && (
              <Link href="/" className="text-[var(--terminal-soft)] underline-offset-4 hover:underline">
                초기화
              </Link>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
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
                    {card.authorName && card.authorHandle ? (
                      <Link href={getProfileHref(card.authorHandle)!} className="underline-offset-4 hover:underline">
                        by {card.authorName}
                      </Link>
                    ) : (
                      <span>author unknown</span>
                    )}
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
