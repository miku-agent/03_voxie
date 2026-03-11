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
  const highlightedCards = allCards.slice(0, 4);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>voxie://archive</span>
            <span>status [live]</span>
          </div>
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--terminal-accent)]">
                vocaloid archive interface
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                보컬로이드 곡과 모먼트를 카드로 모으고, 덱으로 큐레이션하는 아카이브
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--terminal-soft)] sm:text-base">
                좋아하는 곡, 장면, 감정선, 해석을 카드로 남기고 테마별 덱으로 묶어보세요.
                Voxie는 단순 목록이 아니라 왜 이 곡을 기억하는지까지 쌓아가는 커뮤니티형 컬렉션을 목표로 합니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link className="terminal-button" href="#cards">
                  [ 카드 둘러보기 ]
                </Link>
                <Link className="terminal-button" href="#featured-decks">
                  [ 예시 덱 보기 ]
                </Link>
                <Link className="terminal-button" href="/cards/new">
                  [ 카드 작성 ]
                </Link>
              </div>
            </div>

            <aside className="terminal-frame p-4 sm:p-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">
                <span>signal</span>
                <span>{cards.length.toString().padStart(2, "0")} visible</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3 md:grid-cols-1">
                <div className="border border-[var(--terminal-border)] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">cards</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--terminal-fg)]">{allCards.length}</p>
                  <p className="mt-1 text-xs text-[var(--terminal-muted)]">곡/모먼트 기록</p>
                </div>
                <div className="border border-[var(--terminal-border)] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">decks</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--terminal-fg)]">{allDecks.length}</p>
                  <p className="mt-1 text-xs text-[var(--terminal-muted)]">큐레이션 묶음</p>
                </div>
                <div className="border border-[var(--terminal-border)] px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">tags</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--terminal-fg)]">{tags.length}</p>
                  <p className="mt-1 text-xs text-[var(--terminal-muted)]">탐색 포인트</p>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="terminal-frame p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">cards → decks → archive</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-[var(--terminal-fg)]">1. 카드</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  곡, 장면, 감정 포인트를 하나의 기록 단위로 남깁니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--terminal-fg)]">2. 덱</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  같은 시대, 프로듀서, 분위기의 카드를 맥락으로 묶습니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--terminal-fg)]">3. 아카이브</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">
                  단순 DB가 아니라 왜 기억되는지까지 읽히는 컬렉션을 만듭니다.
                </p>
              </div>
            </div>
          </article>

          <article id="featured-decks" className="terminal-frame p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">featured decks</p>
                <h2 className="mt-2 text-xl font-semibold">덱이 왜 필요한지 먼저 보여주기</h2>
              </div>
              <Link className="text-sm text-[var(--terminal-fg)]" href="/decks">
                전체 덱 보기 →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {featuredDecks.map((deck) => (
                <Link key={deck.slug} href={`/decks/${deck.slug}`} className="block border border-[var(--terminal-border)] px-4 py-4">
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-[var(--terminal-muted)]">
                    <span>{deck.name}</span>
                    <span>{deck.cards.length} cards</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">
                    {deck.shortPitch ?? deck.description}
                  </p>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>filter --cards</span>
            <span>{tag ? `tag:${tag}` : "tag:*"}</span>
          </div>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <form action="/" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="곡, 캐릭터, 프로듀서 검색"
                className="w-full border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-3 py-3 text-sm text-[var(--terminal-fg)]"
              />
              <button type="submit" className="terminal-button sm:min-w-36">
                [ 검색 ]
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
                data-testid="tag-all"
                data-active={!tag}
                className="terminal-chip"
              >
                all
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
        </section>

        <section id="cards" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.length === 0 ? (
            <article className="terminal-shell px-6 py-10 md:col-span-2 xl:col-span-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">
                no results detected
              </p>
              <h2 className="mt-3 text-2xl font-semibold">검색 결과가 없어요</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)]">
                다른 태그를 선택하거나 검색어를 줄여보세요. 필요하면 새 카드를 바로 추가해서
                아카이브를 채울 수도 있어요.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="terminal-button" href={tag ? "/" : "/cards/new"}>
                  {tag ? "[ 필터 초기화 ]" : "[ 카드 작성 ]"}
                </Link>
              </div>
            </article>
          ) : (
            cards.map((card) => (
              <article key={card.slug} data-testid="card" className="terminal-frame p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
                  <span>{card.character}</span>
                  <span>{card.type}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold">
                  <Link className="hover:text-[var(--terminal-fg)]" href={`/cards/${card.slug}`}>
                    {card.title}
                  </Link>
                </h2>
                {card.summary && (
                  <p className="mt-2 text-sm leading-6 text-[var(--terminal-soft)]">{card.summary}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--terminal-muted)]">
                  {card.producer && <span>Producer: {card.producer}</span>}
                  {card.year && <span>Year: {card.year}</span>}
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
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">highlight cards</p>
              <h2 className="mt-2 text-xl font-semibold">대표 카드만 봐도 서비스 목적이 보이도록</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlightedCards.map((card) => (
              <Link key={card.slug} href={`/cards/${card.slug}`} className="terminal-frame block p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-soft)]">
                  {card.year ?? "archive"}
                </p>
                <p className="mt-8 text-lg font-semibold">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">{card.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
