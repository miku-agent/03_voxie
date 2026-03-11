import Link from "next/link";
import { filterCards, listTags } from "@/lib/cards";

type Props = {
  searchParams?: { tag?: string };
};

export default function Home({ searchParams }: Props) {
  const tag = searchParams?.tag;
  const cards = filterCards(tag);
  const tags = listTags();

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">Voxie</h1>
          <p className="mt-2 text-sm text-zinc-400">
            보컬로이드 순간을 카드로 모으는 커뮤니티 아카이브
          </p>
        </header>

        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              data-testid="tag-all"
              className={`rounded-full border px-3 py-1 text-xs ${
                !tag ? "border-emerald-400 text-emerald-300" : "border-zinc-700 text-zinc-400"
              }`}
            >
              전체
            </Link>
            {tags.map((item) => (
              <Link
                key={item}
                href={`/?tag=${item}`}
                data-testid={`tag-${item}`}
                className={`rounded-full border px-3 py-1 text-xs ${
                  tag === item
                    ? "border-emerald-400 text-emerald-300"
                    : "border-zinc-700 text-zinc-400"
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
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{card.character}</span>
                <span className="uppercase">{card.type}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    #{item}
                  </span>
                ))}
              </div>
              {card.source_url && (
                <a
                  href={card.source_url}
                  className="mt-4 inline-flex text-xs text-emerald-300"
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
