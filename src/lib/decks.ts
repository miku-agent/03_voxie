import decksSeed from "@/data/decks.json";
import { deckDetails } from "@/data/deck-details";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { isMockWriteModeEnabled, listMockDecks } from "@/lib/mock-db";

export type Deck = {
  slug: string;
  name: string;
  description?: string;
  tags: string[];
  cards: string[];
  shortPitch?: string;
  curatorNote?: string;
  featured?: boolean;
};

export const decks = (decksSeed as Array<Omit<Deck, "shortPitch" | "curatorNote" | "featured">>).map(
  (deck) => ({
    ...deck,
    ...deckDetails[deck.slug],
  })
);

type SupabaseDeckRow = {
  slug: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  deck_cards?: Array<{
    position: number;
    cards: { slug: string } | null;
  }> | null;
};

const enrichDeck = (deck: {
  slug: string;
  name: string;
  description?: string;
  tags: string[];
  cards: string[];
}): Deck => ({
  ...deck,
  ...deckDetails[deck.slug],
});

const normalizeDeck = (deck: SupabaseDeckRow): Deck =>
  enrichDeck({
    slug: deck.slug,
    name: deck.name,
    description: deck.description ?? undefined,
    tags: deck.tags ?? [],
    cards: (deck.deck_cards ?? [])
      .sort((a, b) => a.position - b.position)
      .map((item) => item.cards?.slug)
      .filter((slug): slug is string => Boolean(slug)),
  });

export const getDeckBySlug = (slug: string, items: Deck[] = decks) =>
  items.find((deck) => deck.slug === slug);

export const searchDecks = (query: string, items: Deck[] = decks) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((deck) => {
    return (
      deck.name.toLowerCase().includes(normalized) ||
      (deck.description?.toLowerCase().includes(normalized) ?? false) ||
      (deck.shortPitch?.toLowerCase().includes(normalized) ?? false) ||
      deck.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};

export const listDecks = async (): Promise<Deck[]> => {
  if (isMockWriteModeEnabled()) return listMockDecks().map(enrichDeck);
  if (!isSupabaseConfigured() || !supabase) return decks;

  const { data, error } = await supabase
    .from("decks")
    .select(
      "slug, name, description, tags, deck_cards(position, cards!inner(slug))"
    )
    .order("name", { ascending: true });

  if (error || !data) {
    console.warn("Falling back to local decks seed:", error?.message);
    return decks;
  }

  return (data as unknown as SupabaseDeckRow[]).map(normalizeDeck);
};

export const getDeckBySlugAsync = async (slug: string): Promise<Deck | undefined> => {
  if (isMockWriteModeEnabled()) return getDeckBySlug(slug, listMockDecks().map(enrichDeck));
  if (!isSupabaseConfigured() || !supabase) return getDeckBySlug(slug);

  const { data, error } = await supabase
    .from("decks")
    .select(
      "slug, name, description, tags, deck_cards(position, cards!inner(slug))"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("Falling back to local deck seed:", error.message);
    return getDeckBySlug(slug);
  }

  return normalizeDeck(data as unknown as SupabaseDeckRow);
};
