import { describe, expect, it } from "vitest";
import { cards, getCardBySlug, getCardExternalLinks, searchCards } from "@/lib/cards";

describe("cards archive helpers", () => {
  it("enriches seed cards with archive metadata", () => {
    const card = getCardBySlug("rolling-girl", cards);

    expect(card?.producer).toBe("wowaka");
    expect(card?.summary).toContain("대표곡");
  });

  it("builds deterministic external search links", () => {
    const card = getCardBySlug("melt", cards);
    expect(card).toBeDefined();

    const links = getCardExternalLinks(card!);
    expect(links.youtubeSearch).toContain("Melt%20Hatsune%20Miku");
    expect(links.niconicoSearch).toContain("Melt%20Hatsune%20Miku");
  });

  it("matches producer names in search", () => {
    const results = searchCards("wowaka", cards);
    expect(results.map((card) => card.slug)).toContain("rolling-girl");
  });
});
