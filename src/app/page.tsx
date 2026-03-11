import Link from "next/link";
import { filterCards, listCards, listTags, searchCards } from "@/lib/cards";

type Props = {
  searchParams?: Promise<{ tag?: string; q?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const tag = resolvedSearchParams.tag;
  const query = resolvedSearchParams.q ?? "";
  const allCards = await listCards();
  const cards = filterCards(tag, allCards).filter((card) =>
    searchCards(query, allCards).some((matched) => matched.slug === card.slug)
  );
  const tags = listTags(allCards);

  return (
    <div className="min-h-screen text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="terminal-shell overflow-hidden">
          <div className="terminal-titlebar">
            <span>voxie://miku-archive</span>
            <span>status [live]</span>
          </div>
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--terminal-accent)]">
                Hatsune Miku Console
              </p>
              <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.18em] sm:text-5xl">
                Voxie
                <span className="ml-2 cursor-blink text-[var(--terminal-accent)]">█</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--terminal-muted)] sm:text-base">
                보컬로이드 순간을 카드로 모으는 커뮤니티 아카이브. 미쿠 블루그린
                phosphor 톤으로 다시 튜닝한 터미널 UI예요.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link className="terminal-button" href="/decks">
                  [ 덱 보기 ]
                </Link>
                <Link className="terminal-button" href="/cards/new">
                  [ 카드 작성 ]
                </Link>
              </div>
            </div>

            <div className="terminal-frame p-4 sm:p-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">
                <span>signal</span>
                <span>{cards.length.toString().padStart(2, "0")} cards</span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">theme</span>
                  <span className="text-[var(--terminal-fg)]">miku://39c5bb</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">tags</span>
                  <span className="text-[var(--terminal-fg)]">{tags.length}</span>
                </div>
                <div className="flex items-center justify-between border border-[var(--terminal-border)] px-3 py-2">
                  <span className="text-[var(--terminal-muted)]">query</span>
                  <span className="truncate pl-4 text-right text-[var(--terminal-fg)]">
                    {query || "--all"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

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
                placeholder="search --cards"
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

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.length === 0 ? (
            <article className="terminal-shell px-6 py-10 md:col-span-2 xl:col-span-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--terminal-accent)]">
                no results detected
              </p>
              <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em]">
                검색 결과가 없어요
              </h2>
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
                <h2 className="mt-3 text-lg font-semibold uppercase tracking-[0.08em]">
                  <Link className="hover:text-[var(--terminal-fg)]" href={`/cards/${card.slug}`}>
                    {card.title}
                  </Link>
                </h2>
                <div className="mt-2 h-px bg-[var(--terminal-border)]" />
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((item) => (
                    <span key={item} className="terminal-chip">
                      #{item}
                    </span>
                  ))}
                </div>
                {card.source_url && (
                  <a
                    href={card.source_url}
                    className="mt-4 inline-flex text-xs uppercase tracking-[0.12em] text-[var(--terminal-fg)]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    source --open
                  </a>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
