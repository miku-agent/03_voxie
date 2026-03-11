export type DeckFormInput = {
  name: string;
  tags: string;
  cards: string[];
  description?: string;
};

export type DeckPayload = {
  name: string;
  tags: string[];
  cards: string[];
  description?: string;
};

export const parseDeckTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const buildDeckPayload = (input: DeckFormInput): DeckPayload => ({
  name: input.name.trim(),
  tags: parseDeckTags(input.tags),
  cards: input.cards,
  description: input.description?.trim() || undefined,
});

export const validateDeckPayload = (payload: DeckPayload) => {
  const missing: string[] = [];
  if (!payload.name) missing.push("name");
  if (payload.cards.length === 0) missing.push("cards");
  return missing;
};
