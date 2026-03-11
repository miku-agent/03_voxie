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
  youtube_url?: string;
  summary?: string;
  description?: string[];
  producer?: string;
  year?: number;
  era?: string;
  mood?: string[];
  whyItMatters?: string;
  authorHandle?: string;
  authorName?: string;
};

export const cards = (
  seed as Array<
    Omit<
      Card,
      | "summary"
      | "description"
      | "producer"
      | "year"
      | "era"
      | "mood"
      | "whyItMatters"
      | "authorHandle"
      | "authorName"
    >
  >
).map((card) => ({
  ...card,
  ...cardDetails[card.slug],
}));

const enrichCard = (card: {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[];
  source_url?: string;
  youtube_url?: string;
}): Card => ({
  ...card,
  ...cardDetails[card.slug],
});

type SupabaseCardRow = {
  slug: string;
  title: string;
  type: string;
  character: string;
  tags: string[] | null;
  source_url: string | null;
  youtube_url: string | null;
};

const normalizeCard = (card: SupabaseCardRow): Card =>
  enrichCard({
    slug: card.slug,
    title: card.title,
    type: card.type,
    character: card.character,
    tags: card.tags ?? [],
    source_url: card.source_url ?? undefined,
    youtube_url: card.youtube_url ?? undefined,
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
      (card.authorName?.toLowerCase().includes(normalized) ?? false) ||
      (card.authorHandle?.toLowerCase().includes(normalized) ?? false) ||
      card.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
};

export const listCards = async (): Promise<Card[]> => {
  if (isMockWriteModeEnabled()) return listMockCards().map(enrichCard);
  if (!isSupabaseConfigured() || !supabase) return cards;

  const { data, error } = await supabase
    .from("cards")
    .select("slug, title, type, character, tags, source_url, youtube_url")
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
    .select("slug, title, type, character, tags, source_url, youtube_url")
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
    youtube: card.youtube_url,
    youtubeSearch: `https://www.youtube.com/results?search_query=${query}`,
    niconicoSearch: `https://www.nicovideo.jp/search/${query}`,
  };
};

export const getYouTubeVideoId = (url?: string) => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1).split("/")[0] || null;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2] || null;
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2] || null;
      }
    }

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return undefined;
    return videoId;
  } catch {
    return undefined;
  }
};

export const getYouTubeEmbedUrl = (url?: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
};

export const getYouTubeThumbnailUrl = (url?: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
};

export const getSourceLabel = (url?: string) => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (host.includes("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.includes("nicovideo.jp")) return "Niconico";
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

export const getCardMediaMeta = (card: Card) => {
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(card.youtube_url);
  const sourceLabel = getSourceLabel(card.source_url);
  const videoLabel = getSourceLabel(card.youtube_url);

  return {
    hasRichMedia: Boolean(youtubeThumbnailUrl),
    youtubeThumbnailUrl,
    sourceLabel,
    videoLabel,
    hasSourceMeta: Boolean(sourceLabel || videoLabel),
  };
};
