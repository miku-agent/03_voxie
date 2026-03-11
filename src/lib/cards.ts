import seed from "@/data/seed.json";

export type Card = {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[];
  source_url?: string;
};

export const cards = seed as Card[];

export const listTags = () => {
  const set = new Set<string>();
  cards.forEach((card) => card.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
};

export const filterCards = (tag?: string) => {
  if (!tag) return cards;
  return cards.filter((card) => card.tags.includes(tag));
};

export const getCardBySlug = (slug: string) =>
  cards.find((card) => card.slug === slug);

export const searchCards = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return cards;

  return cards.filter((card) => {
    return (
      card.title.toLowerCase().includes(normalized) ||
      card.character.toLowerCase().includes(normalized) ||
      card.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};
