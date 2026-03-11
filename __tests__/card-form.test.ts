import { describe, expect, it } from "vitest";
import { buildCardPayload, parseTags, validateCardPayload } from "@/lib/card-form";

const base = {
  title: "Melt",
  character: "Hatsune Miku",
  type: "song",
  tags: "classic, romance",
  sourceUrl: "https://example.com",
  youtubeUrl: "https://www.youtube.com/watch?v=o1jAMSQyVPc",
};

describe("card form helpers", () => {
  it("parses tags from comma-separated string", () => {
    expect(parseTags("classic, romance,2007")).toEqual(["classic", "romance", "2007"]);
  });

  it("builds payload including optional youtube url", () => {
    expect(buildCardPayload(base)).toMatchObject({
      title: "Melt",
      character: "Hatsune Miku",
      type: "song",
      tags: ["classic", "romance"],
      source_url: "https://example.com",
      youtube_url: "https://www.youtube.com/watch?v=o1jAMSQyVPc",
    });
  });

  it("validates required fields", () => {
    const payload = buildCardPayload(base);
    expect(validateCardPayload(payload)).toEqual([]);

    const missing = buildCardPayload({ ...base, title: "" });
    expect(validateCardPayload(missing)).toContain("title");
  });
});
