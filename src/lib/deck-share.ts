import type { Deck } from "@/lib/decks";

const DEFAULT_SITE_URL = "https://voxie.bini59.dev";

export const getSiteUrl = () => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
};

export const getDeckShareUrl = (slug: string) => `${getSiteUrl()}/decks/${slug}`;

export const getDeckShareDescription = (deck: Deck) => {
  const parts = [deck.shortPitch, deck.description, deck.intro, deck.readingGuide].filter(Boolean);
  const text = parts[0] ?? "보컬로이드 카드를 덱 단위로 큐레이션해 공유하는 Voxie deck";
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
};
