import { describe, expect, it } from "vitest";
import { cards, getCardBySlug, getYouTubeEmbedUrl } from "@/lib/cards";

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

  it("parses supported youtube urls into embed urls", () => {
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=o1jAMSQyVPc")).toBe(
      "https://www.youtube.com/embed/o1jAMSQyVPc"
    );
    expect(getYouTubeEmbedUrl("https://youtu.be/vnw8zURAxkU")).toBe(
      "https://www.youtube.com/embed/vnw8zURAxkU"
    );
    expect(getYouTubeEmbedUrl("https://www.youtube.com/shorts/o1jAMSQyVPc")).toBe(
      "https://www.youtube.com/embed/o1jAMSQyVPc"
    );
  });

  it("ignores invalid or non-youtube urls", () => {
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBeUndefined();
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=short")).toBeUndefined();
    expect(getYouTubeEmbedUrl("not-a-url")).toBeUndefined();
  });
});
