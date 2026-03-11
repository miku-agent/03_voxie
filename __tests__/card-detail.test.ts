import { describe, expect, it } from "vitest";
import { getCardBySlug, cards } from "@/lib/cards";

describe("card detail", () => {
  it("returns a card by slug", () => {
    const slug = cards[0].slug;
    const card = getCardBySlug(slug);
    expect(card).toBeTruthy();
    expect(card?.slug).toBe(slug);
  });

  it("returns undefined for unknown slug", () => {
    const card = getCardBySlug("missing-slug");
    expect(card).toBeUndefined();
  });
});
