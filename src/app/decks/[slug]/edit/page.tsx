import Link from "next/link";
import { redirect } from "next/navigation";
import { getDeckBySlugAsync, listDecks } from "@/lib/decks";
import { listCards } from "@/lib/cards";
import { getCurrentUser } from "@/lib/auth";
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
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const [deck, cards] = await Promise.all([getDeckBySlugAsync(slug), listCards()]);

  if (!deck) {
    return (
      <div className="min-h-screen text-white">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="terminal-shell px-6 py-10">
            <p className="text-sm text-[var(--terminal-muted)]">덱을 찾을 수 없어요.</p>
            <Link className="mt-6 inline-flex terminal-button" href="/decks">
              [ 덱 목록으로 ]
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!deck.ownerUserId || deck.ownerUserId !== currentUser.id) {
    redirect(`/decks/${slug}?error=forbidden`);
  }

  return <DeckEditClient deck={deck} cards={cards} />;
}
