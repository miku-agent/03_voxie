import Link from "next/link";
import { filterCards, listTags, searchCards } from "@/lib/cards";

type Props = {
  searchParams?: { tag?: string; q?: string };
};

export default function Home({ searchParams }: Props) {
  const tag = searchParams?.tag;
  const query = searchParams?.q ?? "";
  const cards = filterCards(tag).filter((card) =>
    searchCards(query).some((matched) => matched.slug === card.slug)
  );
  const tags = listTags();

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">Voxie</h1>
          <p className="mt-2 text-sm text-[var(--terminal-muted)]">
            보컬로이드 순간을 카드로 모으는 커뮤니티 아카이브
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <Link className="text-[var(--terminal-fg)]" href="/decks">
              덱 보기 →
            </Link>
            <Link className="text-[var(--terminal-fg)]" href="/cards/new">
              카드 작성 →
            </Link>
          </div>
        </header>

        <section className="mb-8 space-y-4">
          <form action="/" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="search --cards"
              className="w-full border border-[var(--terminal-border)] bg-black px-3 py-2 text-sm text-[var(--terminal-fg)]"
            />
            <button type="submit" className="terminal-button">
              [ 검색 ]
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
              data-testid="tag-all"
              className={`rounded-full border px-3 py-1 text-xs ${
                !tag ? "border-emerald-400 text-[var(--terminal-fg)]" : "border-zinc-700 text-[var(--terminal-muted)]"
              }`}
            >
              전체
            </Link>
            {tags.map((item) => (
              <Link
                key={item}
                href={`/?tag=${item}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                data-testid={`tag-${item}`}
                className={`rounded-full border px-3 py-1 text-xs ${
                  tag === item
                    ? "border-emerald-400 text-[var(--terminal-fg)]"
                    : "border-zinc-700 text-[var(--terminal-muted)]"
                }`}
              >
                #{item}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.slug}
              data-testid="card"
              className="terminal-frame p-5"
            >
              <div className="flex items-center justify-between text-xs text-[var(--terminal-muted)]">
                <span>{card.character}</span>
                <span className="uppercase">{card.type}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">
                <Link className="hover:text-[var(--terminal-fg)]" href={`/cards/${card.slug}`}>
                  {card.title}
                </Link>
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span
                    key={item}
                    className="border border-[var(--terminal-border)] px-2 py-0.5 text-[10px] text-[var(--terminal-muted)]"
                  >
                    #{item}
                  </span>
                ))}
              </div>
              {card.source_url && (
                <a
                  href={card.source_url}
                  className="mt-4 inline-flex text-xs text-[var(--terminal-fg)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  출처 보기
                </a>
              )}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
