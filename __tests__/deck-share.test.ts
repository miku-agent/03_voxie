import { describe, expect, it, vi } from "vitest";
import { decks, getDeckBySlug } from "@/lib/decks";
import { getDeckShareDescription, getDeckShareUrl } from "@/lib/deck-share";

describe("deck share helpers", () => {
  it("builds a stable public deck url from slug", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://voxie.test");
    expect(getDeckShareUrl("classic-miku")).toBe("https://voxie.test/decks/classic-miku");
    vi.unstubAllEnvs();
  });

  it("creates a readable share description from deck content", () => {
    const deck = getDeckBySlug("classic-miku", decks);
    expect(deck).toBeTruthy();
    expect(getDeckShareDescription(deck!)).toContain("Voxie");
  });
});
