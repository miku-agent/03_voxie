import decksSeed from "@/data/decks.json";

export type Deck = {
  slug: string;
  name: string;
  description?: string;
  tags: string[];
  cards: string[];
};

export const decks = decksSeed as Deck[];

export const getDeckBySlug = (slug: string) =>
  decks.find((deck) => deck.slug === slug);

export const searchDecks = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return decks;

  return decks.filter((deck) => {
    return (
      deck.name.toLowerCase().includes(normalized) ||
      (deck.description?.toLowerCase().includes(normalized) ?? false) ||
      deck.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};
