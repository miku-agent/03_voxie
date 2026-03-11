import { describe, expect, it } from "vitest";
import { filterCards, listTags, cards } from "@/lib/cards";

describe("cards library", () => {
  it("lists all tags", () => {
    const tags = listTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags).toEqual([...tags].sort());
  });

  it("filters cards by tag", () => {
    const tag = cards[0].tags[0];
    const filtered = filterCards(tag);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((card) => {
      expect(card.tags).toContain(tag);
    });
  });
});
