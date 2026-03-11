import Link from "next/link";
import { getDeckBySlugAsync, listDecks } from "@/lib/decks";
import { listCards } from "@/lib/cards";
import DeckEditClient from "./DeckEditClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const decks = await listDecks();
  return decks.map((deck) => ({ slug: deck.slug }));
}

export default async function DeckEditPage({ params }: Props) {
  const { slug } = await params;
  const [deck, cards] = await Promise.all([getDeckBySlugAsync(slug), listCards()]);

  if (!deck) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-sm text-[var(--terminal-muted)]">덱을 찾을 수 없어요.</p>
          <Link className="mt-6 inline-flex text-[var(--terminal-fg)]" href="/decks">
            ← 덱 목록으로
          </Link>
        </main>
      </div>
    );
  }

  return <DeckEditClient deck={deck} cards={cards} />;
}
