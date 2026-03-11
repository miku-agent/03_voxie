import { describe, expect, it } from "vitest";
import { getDeckSocialMeta, getProfileSocialMeta } from "@/lib/social";

describe("social metadata", () => {
  it("returns seed social stats for known decks", () => {
    expect(getDeckSocialMeta("classic-miku")).toEqual({ likes: 128, bookmarks: 44 });
  });

  it("returns follower stats for known curators", () => {
    expect(getProfileSocialMeta("bini59").followers).toBeGreaterThan(0);
  });
});
