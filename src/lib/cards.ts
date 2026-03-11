import seed from "@/data/seed.json";
import { cardDetails } from "@/data/card-details";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { isMockWriteModeEnabled, listMockCards } from "@/lib/mock-db";

export type Card = {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[];
  source_url?: string;
  summary?: string;
  description?: string[];
  producer?: string;
  year?: number;
  era?: string;
  mood?: string[];
  whyItMatters?: string;
};

export const cards = (seed as Array<Omit<Card, "summary" | "description" | "producer" | "year" | "era" | "mood" | "whyItMatters">>).map(
  (card) => ({
    ...card,
    ...cardDetails[card.slug],
  })
);

const enrichCard = (card: {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[];
  source_url?: string;
}): Card => ({
  ...card,
  ...cardDetails[card.slug],
});

const normalizeCard = (card: {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[] | null;
  source_url: string | null;
}): Card =>
  enrichCard({
    slug: card.slug,
    title: card.title,
    type: card.type,
    character: card.character,
    tags: card.tags ?? [],
    source_url: card.source_url ?? undefined,
  });

export const listTags = (items: Card[] = cards) => {
  const set = new Set<string>();
  items.forEach((card) => card.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
};

export const filterCards = (tag?: string, items: Card[] = cards) => {
  if (!tag) return items;
  return items.filter((card) => card.tags.includes(tag));
};

export const getCardBySlug = (slug: string, items: Card[] = cards) =>
  items.find((card) => card.slug === slug);

export const searchCards = (query: string, items: Card[] = cards) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((card) => {
    return (
      card.title.toLowerCase().includes(normalized) ||
      card.character.toLowerCase().includes(normalized) ||
      (card.producer?.toLowerCase().includes(normalized) ?? false) ||
      card.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};

export const listCards = async (): Promise<Card[]> => {
  if (isMockWriteModeEnabled()) return listMockCards().map(enrichCard);
  if (!isSupabaseConfigured() || !supabase) return cards;

  const { data, error } = await supabase
    .from("cards")
    .select("slug, title, type, character, tags, source_url")
    .order("title", { ascending: true });

  if (error || !data) {
    console.warn("Falling back to local cards seed:", error?.message);
    return cards;
  }

  return data.map(normalizeCard);
};

export const getCardBySlugAsync = async (slug: string): Promise<Card | undefined> => {
  if (isMockWriteModeEnabled()) {
    const card = getCardBySlug(slug, listMockCards());
    return card ? enrichCard(card) : undefined;
  }
  if (!isSupabaseConfigured() || !supabase) return getCardBySlug(slug);

  const { data, error } = await supabase
    .from("cards")
    .select("slug, title, type, character, tags, source_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("Falling back to local card seed:", error.message);
    return getCardBySlug(slug);
  }

  return normalizeCard(data);
};

export const getCardExternalLinks = (card: Card) => {
  const query = encodeURIComponent(`${card.title} ${card.character}`);

  return {
    source: card.source_url,
    youtubeSearch: `https://www.youtube.com/results?search_query=${query}`,
    niconicoSearch: `https://www.nicovideo.jp/search/${query}`,
  };
};
