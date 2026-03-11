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
