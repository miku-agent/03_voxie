import decksSeed from "@/data/decks.json";
import { deckDetails } from "@/data/deck-details";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { isMockWriteModeEnabled, listMockDecks } from "@/lib/mock-db";

export type DeckCardNote = {
  lead?: string;
  note?: string;
};

export type Deck = {
  slug: string;
  name: string;
  description?: string;
  intro?: string;
  curatorNote?: string;
  tags: string[];
  cards: string[];
  shortPitch?: string;
  introTitle?: string;
  introBody?: string;
  readingGuide?: string;
  featured?: boolean;
  ownerUserId?: string;
  authorHandle?: string;
  authorName?: string;
  cardNotes?: Record<string, DeckCardNote>;
};

export const decks = (
  decksSeed as Array<
    Omit<
      Deck,
      | "intro"
      | "curatorNote"
      | "shortPitch"
      | "introTitle"
      | "introBody"
      | "readingGuide"
      | "featured"
      | "authorHandle"
      | "authorName"
      | "cardNotes"
    >
  >
).map((deck) => ({
  ...deck,
  ...deckDetails[deck.slug],
}));

type SupabaseDeckRow = {
  slug: string;
  name: string;
  description: string | null;
  intro: string | null;
  curator_note: string | null;
  owner_user_id: string | null;
  author_handle: string | null;
  author_name: string | null;
  tags: string[] | null;
  deck_cards?:
    | Array<{
        position: number;
        cards: { slug: string } | null;
      }>
    | null;
};

const enrichDeck = (deck: {
  slug: string;
  name: string;
  description?: string;
  intro?: string;
  curatorNote?: string;
  tags: string[];
  cards: string[];
  ownerUserId?: string;
  authorHandle?: string;
  authorName?: string;
}): Deck => ({
  ...deckDetails[deck.slug],
  ...deck,
});

const normalizeDeck = (deck: SupabaseDeckRow): Deck =>
  enrichDeck({
    slug: deck.slug,
    name: deck.name,
    description: deck.description ?? undefined,
    intro: deck.intro ?? undefined,
    curatorNote: deck.curator_note ?? undefined,
    ownerUserId: deck.owner_user_id ?? undefined,
    authorHandle: deck.author_handle ?? undefined,
    authorName: deck.author_name ?? undefined,
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
      (deck.intro?.toLowerCase().includes(normalized) ?? false) ||
      (deck.shortPitch?.toLowerCase().includes(normalized) ?? false) ||
      (deck.authorName?.toLowerCase().includes(normalized) ?? false) ||
      (deck.authorHandle?.toLowerCase().includes(normalized) ?? false) ||
      deck.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};

const DECK_SELECT =
  "slug, name, description, intro, curator_note, owner_user_id, author_handle, author_name, tags, deck_cards(position, cards!inner(slug))";

export const listDecks = async (): Promise<Deck[]> => {
  if (isMockWriteModeEnabled()) return listMockDecks().map(enrichDeck);
  if (!isSupabaseConfigured() || !supabase) return decks;

  const { data, error } = await supabase
    .from("decks")
    .select(DECK_SELECT)
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
    .select(DECK_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("Falling back to local deck seed:", error.message);
    return getDeckBySlug(slug);
  }

  return normalizeDeck(data as unknown as SupabaseDeckRow);
};
