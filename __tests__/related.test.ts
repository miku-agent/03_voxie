import { describe, expect, it } from "vitest";
import { cards } from "@/lib/cards";
import { decks } from "@/lib/decks";
import { getRelatedCards, getRelatedDecks } from "@/lib/related";

describe("related discovery", () => {
  it("finds related decks from shared tags/cards", () => {
    const target = decks.find((deck) => deck.slug === "classic-miku");
    expect(target).toBeTruthy();

    const related = getRelatedDecks(target!, decks);
    expect(related.map((deck) => deck.slug)).toContain("stage-hits");
  });

  it("finds related cards from shared metadata", () => {
    const target = cards.find((card) => card.slug === "melt");
    expect(target).toBeTruthy();

    const related = getRelatedCards(target!, cards);
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((card) => card.slug === "world-is-mine" || card.slug === "reverse-rainbow")).toBe(true);
  });
});
