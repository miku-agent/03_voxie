import { describe, expect, it } from "vitest";
import { cards, getCardBySlug, getCardMediaMeta, getSourceLabel, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/cards";

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

  it("builds thumbnail and source metadata for video-enabled cards", () => {
    const card = getCardBySlug("melt");
    expect(card).toBeTruthy();
    expect(getYouTubeThumbnailUrl(card?.youtube_url)).toBe("https://img.youtube.com/vi/o1jAMSQyVPc/hqdefault.jpg");
    expect(getSourceLabel(card?.youtube_url)).toBe("YouTube");
    expect(getCardMediaMeta(card!)).toMatchObject({
      hasRichMedia: true,
      videoLabel: "YouTube",
      youtubeThumbnailUrl: "https://img.youtube.com/vi/o1jAMSQyVPc/hqdefault.jpg",
    });
  });

  it("ignores invalid or non-youtube urls", () => {
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBeUndefined();
    expect(getYouTubeThumbnailUrl("https://example.com/video")).toBeUndefined();
    expect(getSourceLabel("https://example.com/video")).toBe("example.com");
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=short")).toBeUndefined();
    expect(getYouTubeEmbedUrl("not-a-url")).toBeUndefined();
  });
});
