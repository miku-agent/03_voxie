export type CardFormInput = {
  title: string;
  character: string;
  type: string;
  tags: string;
  sourceUrl?: string;
  youtubeUrl?: string;
};

export type CardPayload = {
  title: string;
  character: string;
  type: string;
  tags: string[];
  source_url?: string;
  youtube_url?: string;
};

export const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const buildCardPayload = (input: CardFormInput): CardPayload => ({
  title: input.title.trim(),
  character: input.character.trim(),
  type: input.type.trim(),
  tags: parseTags(input.tags),
  source_url: input.sourceUrl?.trim() || undefined,
  youtube_url: input.youtubeUrl?.trim() || undefined,
});

export const validateCardPayload = (payload: CardPayload) => {
  const missing: string[] = [];
  if (!payload.title) missing.push("title");
  if (!payload.character) missing.push("character");
  if (!payload.type) missing.push("type");
  if (payload.tags.length === 0) missing.push("tags");
  return missing;
};
