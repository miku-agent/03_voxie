import { describe, expect, it } from "vitest";
import { decks, getDeckBySlug, searchDecks } from "@/lib/decks";

describe("decks library", () => {
  it("loads onboarding-ready seed decks", () => {
    expect(decks.length).toBeGreaterThanOrEqual(5);
    expect(decks.filter((deck) => deck.featured).length).toBeGreaterThanOrEqual(3);
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

  it("enriches decks with story metadata for readable detail pages", () => {
    const deck = getDeckBySlug("classic-miku");
    expect(deck?.introTitle).toContain("입문 서사");
    expect(deck?.readingGuide).toContain("순서대로 읽으면");
    expect(deck?.cardNotes?.melt?.lead).toBe("시작점");
  });
});
