import { describe, expect, it } from "vitest";
import { searchCards } from "@/lib/cards";
import { searchDecks } from "@/lib/decks";

describe("search filters", () => {
  it("finds cards by title or tag", () => {
    expect(searchCards("melt").map((card) => card.slug)).toContain("melt");
    expect(searchCards("classic").length).toBeGreaterThan(0);
  });

  it("returns all cards for empty query", () => {
    expect(searchCards("").length).toBeGreaterThan(0);
  });

  it("finds decks by name or tag", () => {
    expect(searchDecks("classic").map((deck) => deck.slug)).toContain("classic-miku");
    expect(searchDecks("live").map((deck) => deck.slug)).toContain("stage-hits");
  });
});
