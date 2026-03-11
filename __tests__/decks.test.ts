import { describe, expect, it } from "vitest";
import { decks, getDeckBySlug, searchDecks } from "@/lib/decks";

describe("decks library", () => {
  it("loads deck seed", () => {
    expect(decks.length).toBeGreaterThan(0);
  });

  it("finds deck by slug", () => {
    const deck = getDeckBySlug(decks[0].slug);
    expect(deck?.slug).toBe(decks[0].slug);
  });

  it("includes author attribution and supports author search", () => {
    const deck = getDeckBySlug("classic-miku");
    expect(deck?.authorHandle).toBe("bini59");
    expect(searchDecks("빈이", decks).map((item) => item.slug)).toContain("classic-miku");
  });
});
