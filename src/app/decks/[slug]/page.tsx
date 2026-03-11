import Link from "next/link";
import { getDeckBySlug } from "@/lib/decks";
import { getCardBySlug } from "@/lib/cards";

type Props = {
  params: { slug: string };
};

export default function DeckDetailPage({ params }: Props) {
  const deck = getDeckBySlug(params.slug);

  if (!deck) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm text-zinc-400">덱을 찾을 수 없어요.</p>
          <Link className="mt-6 inline-flex text-emerald-300" href="/decks">
            ← 덱 목록으로
          </Link>
        </main>
      </div>
    );
  }

  const cards = deck.cards
    .map((slug) => getCardBySlug(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link className="text-sm text-emerald-300" href="/decks">
          ← 덱 목록으로
        </Link>

        <article className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-2xl font-semibold">{deck.name}</h1>
          {deck.description && (
            <p className="mt-2 text-sm text-zinc-400">{deck.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {deck.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        <section className="mt-8 grid gap-4">
          {cards.map((card) => (
            <div
              key={card?.slug}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{card?.character}</span>
                <span className="uppercase">{card?.type}</span>
              </div>
              <Link
                className="mt-2 inline-flex text-lg font-semibold hover:text-emerald-300"
                href={`/cards/${card?.slug}`}
              >
                {card?.title}
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
