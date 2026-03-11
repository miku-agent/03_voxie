import Link from "next/link";
import { decks } from "@/lib/decks";

export default function DeckListPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">덱</h1>
          <p className="mt-2 text-sm text-zinc-400">
            카드로 묶은 플레이리스트
          </p>
          <div className="mt-4">
            <Link className="text-emerald-300" href="/decks/new">
              덱 생성 →
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {decks.map((deck) => (
            <article
              key={deck.slug}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{deck.cards.length} cards</span>
                <span className="uppercase">deck</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">
                <Link className="hover:text-emerald-300" href={`/decks/${deck.slug}`}>
                  {deck.name}
                </Link>
              </h2>
              {deck.description && (
                <p className="mt-2 text-sm text-zinc-400">
                  {deck.description}
                </p>
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
          ))}
        </section>
      </main>
    </div>
  );
}
