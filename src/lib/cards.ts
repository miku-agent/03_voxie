import seed from "@/data/seed.json";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { isMockWriteModeEnabled, listMockCards } from "@/lib/mock-db";

export type Card = {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[];
  source_url?: string;
};

export const cards = seed as Card[];

const normalizeCard = (card: {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[] | null;
  source_url: string | null;
}): Card => ({
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
      card.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};

export const listCards = async (): Promise<Card[]> => {
  if (isMockWriteModeEnabled()) return listMockCards();
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
  if (isMockWriteModeEnabled()) return getCardBySlug(slug, listMockCards());
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
