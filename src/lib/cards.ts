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
