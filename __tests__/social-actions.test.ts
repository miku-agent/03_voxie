import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("social actions", () => {
  it("returns an auth error when unauthenticated users try to like a deck", async () => {
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () => Promise.resolve({ error: "로그인이 필요해요. 먼저 Voxie 계정으로 로그인해 주세요." }),
    }));

    const { toggleDeckLike } = await import("@/lib/actions/social");
    await expect(toggleDeckLike("classic-miku")).resolves.toEqual({
      success: false,
      error: "로그인이 필요해요. 먼저 Voxie 계정으로 로그인해 주세요.",
    });
  });

  it("creates a like when the viewer has not liked the deck yet", async () => {
    const deckMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "deck-1" }, error: null });
    const existingMaybeSingle = vi.fn().mockResolvedValue({ data: null });
    const likeInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "decks") {
        return { select: () => ({ eq: () => ({ maybeSingle: deckMaybeSingle }) }) };
      }
      if (table === "deck_likes") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: existingMaybeSingle }) }) }),
          insert: likeInsert,
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("next/cache", () => ({ revalidatePath: vi.fn() }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({ identity: { userId: "user-1", handle: "bini59", name: "빈이" }, user: { id: "user-1" } }),
    }));
    vi.doMock("@/lib/supabase/server", () => ({
      createSupabaseServerClient: () => Promise.resolve({ from }),
    }));

    const { toggleDeckLike } = await import("@/lib/actions/social");
    await expect(toggleDeckLike("classic-miku")).resolves.toEqual({ success: true, liked: true });
    expect(likeInsert).toHaveBeenCalledWith({ deck_id: "deck-1", user_id: "user-1" });
  });

  it("removes a bookmark when the viewer already bookmarked the deck", async () => {
    const deckMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "deck-1" }, error: null });
    const existingMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "bookmark-1" } });
    const deleteEq = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "decks") {
        return { select: () => ({ eq: () => ({ maybeSingle: deckMaybeSingle }) }) };
      }
      if (table === "deck_bookmarks") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: existingMaybeSingle }) }) }),
          delete: () => ({ eq: deleteEq }),
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("next/cache", () => ({ revalidatePath: vi.fn() }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({ identity: { userId: "user-1", handle: "bini59", name: "빈이" }, user: { id: "user-1" } }),
    }));
    vi.doMock("@/lib/supabase/server", () => ({
      createSupabaseServerClient: () => Promise.resolve({ from }),
    }));

    const { toggleDeckBookmark } = await import("@/lib/actions/social");
    await expect(toggleDeckBookmark("classic-miku")).resolves.toEqual({ success: true, bookmarked: false });
    expect(deleteEq).toHaveBeenCalledWith("id", "bookmark-1");
  });

  it("creates a follow when the viewer has not followed the curator yet", async () => {
    const existingMaybeSingle = vi.fn().mockResolvedValue({ data: null });
    const followInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "curator_follows") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: existingMaybeSingle }) }) }),
          insert: followInsert,
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("next/cache", () => ({ revalidatePath: vi.fn() }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({ identity: { userId: "user-1", handle: "bini59", name: "빈이" }, user: { id: "user-1" } }),
    }));
    vi.doMock("@/lib/supabase/server", () => ({
      createSupabaseServerClient: () => Promise.resolve({ from }),
    }));

    const { toggleCuratorFollow } = await import("@/lib/actions/social");
    await expect(toggleCuratorFollow("miku")).resolves.toEqual({ success: true, followed: true });
    expect(followInsert).toHaveBeenCalledWith({ curator_handle: "miku", user_id: "user-1" });
  });

  it("prevents users from following themselves", async () => {
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({ identity: { userId: "user-1", handle: "bini59", name: "빈이" }, user: { id: "user-1" } }),
    }));

    const { toggleCuratorFollow } = await import("@/lib/actions/social");
    await expect(toggleCuratorFollow("bini59")).resolves.toEqual({
      success: false,
      error: "자기 자신은 팔로우할 수 없어요.",
    });
  });
});
