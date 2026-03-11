import { describe, expect, it } from "vitest";
import { cards } from "@/lib/cards";
import { decks } from "@/lib/decks";
import {
  buildCuratorDiscoveryLinks,
  buildEraDiscoveryLinks,
  buildThemeDiscoveryLinks,
} from "@/lib/home";

describe("home discovery helpers", () => {
  it("builds theme links from deck tags", () => {
    const links = buildThemeDiscoveryLinks(decks);
    expect(links.map((item) => item.label)).toContain("#classic");
  });

  it("builds era links from card metadata", () => {
    const links = buildEraDiscoveryLinks(cards);
    expect(links.some((item) => item.label.includes("NicoNico"))).toBe(true);
  });

  it("builds curator links from authored decks", () => {
    const links = buildCuratorDiscoveryLinks(decks);
    expect(links.some((item) => item.href === "/users/bini59")).toBe(true);
  });
});
