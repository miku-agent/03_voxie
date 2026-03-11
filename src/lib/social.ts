import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DeckSocialMeta = {
  likes: number;
  bookmarks: number;
  viewerHasLiked: boolean;
  viewerHasBookmarked: boolean;
  requiresAuth: boolean;
};

export type ProfileSocialMeta = {
  followers: number;
};

const deckSocialSeed: Record<string, { likes: number; bookmarks: number }> = {
  "classic-miku": { likes: 128, bookmarks: 44 },
  "stage-hits": { likes: 97, bookmarks: 31 },
  "niconico-explosion-2007": { likes: 76, bookmarks: 29 },
  "miku-meme-starter": { likes: 63, bookmarks: 25 },
  "emotion-arc": { likes: 54, bookmarks: 22 },
};

const profileSocialSeed: Record<string, ProfileSocialMeta> = {
  bini59: { followers: 142 },
  miku: { followers: 256 },
};

export const getDeckSeedSocialMeta = (slug: string) => {
  return deckSocialSeed[slug] ?? { likes: 0, bookmarks: 0 };
};

export const getProfileSocialMeta = (handle: string): ProfileSocialMeta => {
  return profileSocialSeed[handle] ?? { followers: 0 };
};

export const getDeckSocialMeta = async (slug: string): Promise<DeckSocialMeta> => {
  const seed = getDeckSeedSocialMeta(slug);
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase) {
    return {
      likes: seed.likes,
      bookmarks: seed.bookmarks,
      viewerHasLiked: false,
      viewerHasBookmarked: false,
      requiresAuth: true,
    };
  }

  const { data: deck } = await (supabase.from("decks") as any).select("id").eq("slug", slug).maybeSingle();

  if (!deck) {
    return {
      likes: seed.likes,
      bookmarks: seed.bookmarks,
      viewerHasLiked: false,
      viewerHasBookmarked: false,
      requiresAuth: !user,
    };
  }

  const [{ data: likes }, { data: bookmarks }] = await Promise.all([
    (supabase.from("deck_likes") as any).select("user_id").eq("deck_id", deck.id),
    (supabase.from("deck_bookmarks") as any).select("user_id").eq("deck_id", deck.id),
  ]);

  return {
    likes: likes?.length ?? seed.likes,
    bookmarks: bookmarks?.length ?? seed.bookmarks,
    viewerHasLiked: Boolean(user && likes?.some((entry: { user_id: string }) => entry.user_id === user.id)),
    viewerHasBookmarked: Boolean(user && bookmarks?.some((entry: { user_id: string }) => entry.user_id === user.id)),
    requiresAuth: !user,
  };
};
