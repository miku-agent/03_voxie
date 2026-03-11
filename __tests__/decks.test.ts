import { describe, expect, it } from "vitest";
import { decks, getDeckBySlug } from "@/lib/decks";

describe("decks library", () => {
  it("loads deck seed", () => {
    expect(decks.length).toBeGreaterThan(0);
  });

  it("finds deck by slug", () => {
    const deck = getDeckBySlug(decks[0].slug);
    expect(deck?.slug).toBe(decks[0].slug);
  });
});
