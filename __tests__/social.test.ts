import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("social metadata", () => {
  it("returns seed social stats when Supabase is unavailable", async () => {
    vi.doMock("@/lib/supabase/server", () => ({
      createSupabaseServerClient: () => Promise.resolve(null),
    }));
    vi.doMock("@/lib/auth", () => ({
      getCurrentUser: () => Promise.resolve(null),
    }));

    const { getDeckSocialMeta } = await import("@/lib/social");

    await expect(getDeckSocialMeta("classic-miku")).resolves.toEqual({
      likes: 128,
      bookmarks: 44,
      viewerHasLiked: false,
      viewerHasBookmarked: false,
      requiresAuth: true,
    });
  });

  it("returns persisted social state for the current user when Supabase is available", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: "deck-1" } });
    const likeEqDeck = vi.fn().mockResolvedValue({ data: [{ user_id: "user-1" }, { user_id: "user-2" }] });
    const bookmarkEqDeck = vi.fn().mockResolvedValue({ data: [{ user_id: "user-1" }] });
    const deckEqSlug = vi.fn(() => ({ maybeSingle }));

    const from = vi.fn((table: string) => {
      if (table === "decks") {
        return { select: () => ({ eq: deckEqSlug }) };
      }
      if (table === "deck_likes") {
        return { select: () => ({ eq: likeEqDeck }) };
      }
      if (table === "deck_bookmarks") {
        return { select: () => ({ eq: bookmarkEqDeck }) };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("@/lib/supabase/server", () => ({
      createSupabaseServerClient: () => Promise.resolve({ from }),
    }));
    vi.doMock("@/lib/auth", () => ({
      getCurrentUser: () => Promise.resolve({ id: "user-1" }),
    }));

    const { getDeckSocialMeta } = await import("@/lib/social");

    await expect(getDeckSocialMeta("classic-miku")).resolves.toEqual({
      likes: 2,
      bookmarks: 1,
      viewerHasLiked: true,
      viewerHasBookmarked: true,
      requiresAuth: false,
    });
  });

  it("returns follower stats for known curators", async () => {
    const { getProfileSocialMeta } = await import("@/lib/social");
    expect(getProfileSocialMeta("bini59").followers).toBeGreaterThan(0);
  });
});
