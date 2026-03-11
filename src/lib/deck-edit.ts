export type DeckUpdateInput = {
  name: string;
  description?: string;
  intro?: string;
  curatorNote?: string;
  tags: string[];
  cards: string[];
};

export const buildDeckUpdatePayload = (input: DeckUpdateInput) => ({
  name: input.name.trim(),
  description: input.description?.trim() || undefined,
  intro: input.intro?.trim() || undefined,
  curatorNote: input.curatorNote?.trim() || undefined,
  tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
  cards: input.cards,
});

export const validateDeckUpdatePayload = (
  payload: ReturnType<typeof buildDeckUpdatePayload>
) => {
  const errors: string[] = [];
  if (!payload.name) errors.push("name");
  if (payload.cards.length === 0) errors.push("cards");
  return errors;
};
