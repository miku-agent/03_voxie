import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath,
}));

describe("deck actions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns a local mode error when deck creation is attempted without Supabase", async () => {
    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => false,
      supabase: null,
    }));

    const { createDeck } = await import("@/lib/actions/decks");

    await expect(
      createDeck({
        name: "Classic Miku",
        description: "대표곡 모음",
        tags: ["classic", "miku"],
        cards: ["melt"],
      })
    ).resolves.toEqual({
      success: false,
      error: "Supabase not configured. Deck creation is disabled in local mode.",
    });
  });

  it("creates a deck, links cards, and revalidates deck pages", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);

    const single = vi.fn().mockResolvedValue({
      data: { id: 77, slug: "classic-miku-1234567890", name: "Classic Miku" },
      error: null,
    });
    const decksSelect = vi.fn(() => ({ single }));
    const decksInsert = vi.fn(() => ({ select: decksSelect }));

    const cardsIn = vi.fn().mockResolvedValue({
      data: [
        { id: 1, slug: "melt" },
        { id: 2, slug: "world-is-mine" },
      ],
      error: null,
    });
    const cardsSelect = vi.fn(() => ({ in: cardsIn }));

    const deckCardsInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "decks") {
        return { insert: decksInsert };
      }
      if (table === "cards") {
        return { select: cardsSelect };
      }
      if (table === "deck_cards") {
        return { insert: deckCardsInsert };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => true,
      supabase: { from },
    }));

    const { createDeck } = await import("@/lib/actions/decks");

    const result = await createDeck({
      name: "Classic Miku",
      description: "대표곡 모음",
      tags: ["classic", "miku"],
      cards: ["melt", "world-is-mine"],
    });

    expect(from).toHaveBeenCalledWith("decks");
    expect(decksInsert).toHaveBeenCalledWith({
      slug: "classic-miku-1234567890",
      name: "Classic Miku",
      description: "대표곡 모음",
      tags: ["classic", "miku"],
    });
    expect(deckCardsInsert).toHaveBeenCalledWith([
      { deck_id: 77, card_id: 1, position: 0 },
      { deck_id: 77, card_id: 2, position: 1 },
    ]);
    expect(result).toEqual({
      success: true,
      data: {
        slug: "classic-miku-1234567890",
        name: "Classic Miku",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/decks");
    expect(revalidatePath).toHaveBeenCalledWith("/decks/classic-miku-1234567890");
  });

  it("updates a deck, replaces linked cards, and revalidates edit pages", async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: 77 },
      error: null,
    });
    const eqForSelect = vi.fn(() => ({ single }));
    const select = vi.fn(() => ({ eq: eqForSelect }));

    const eqForUpdate = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq: eqForUpdate }));

    const eqForDelete = vi.fn().mockResolvedValue({ error: null });
    const deleteFn = vi.fn(() => ({ eq: eqForDelete }));

    const cardsIn = vi.fn().mockResolvedValue({
      data: [
        { id: 4, slug: "melt" },
        { id: 9, slug: "rolling-girl" },
      ],
      error: null,
    });
    const cardsSelect = vi.fn(() => ({ in: cardsIn }));

    const deckCardsInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "decks") {
        return {
          select,
          update,
        };
      }
      if (table === "deck_cards") {
        return {
          delete: deleteFn,
          insert: deckCardsInsert,
        };
      }
      if (table === "cards") {
        return {
          select: cardsSelect,
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => true,
      supabase: { from },
    }));

    const { updateDeck } = await import("@/lib/actions/decks");

    const result = await updateDeck("classic-miku", {
      name: "Classic Miku Reloaded",
      description: "대표곡 업데이트",
      tags: ["classic", "live", ""],
      cards: ["melt", "rolling-girl"],
    });

    expect(select).toHaveBeenCalledWith("id");
    expect(eqForSelect).toHaveBeenCalledWith("slug", "classic-miku");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Classic Miku Reloaded",
        description: "대표곡 업데이트",
        tags: ["classic", "live"],
      })
    );
    expect(eqForUpdate).toHaveBeenCalledWith("id", 77);
    expect(eqForDelete).toHaveBeenCalledWith("deck_id", 77);
    expect(deckCardsInsert).toHaveBeenCalledWith([
      { deck_id: 77, card_id: 4, position: 0 },
      { deck_id: 77, card_id: 9, position: 1 },
    ]);
    expect(result).toEqual({
      success: true,
      data: {
        slug: "classic-miku",
        name: "Classic Miku Reloaded",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/decks");
    expect(revalidatePath).toHaveBeenCalledWith("/decks/classic-miku");
    expect(revalidatePath).toHaveBeenCalledWith("/decks/classic-miku/edit");
  });

  it("returns not found when update target deck does not exist", async () => {
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "No rows found" },
    });
    const eq = vi.fn(() => ({ single }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => true,
      supabase: { from },
    }));

    const { updateDeck } = await import("@/lib/actions/decks");

    await expect(
      updateDeck("missing-deck", {
        name: "Missing",
        description: "",
        tags: [],
        cards: ["melt"],
      })
    ).resolves.toEqual({
      success: false,
      error: "Deck not found",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
