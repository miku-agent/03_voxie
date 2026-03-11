import { describe, expect, it } from "vitest";
import { buildCardPayload, parseTags, validateCardPayload } from "@/lib/card-form";

const base = {
  title: "Melt",
  character: "Hatsune Miku",
  type: "song",
  tags: "classic, romance",
  sourceUrl: "https://example.com",
};

describe("card form helpers", () => {
  it("parses tags from comma-separated string", () => {
    expect(parseTags("classic, romance,2007")).toEqual([
      "classic",
      "romance",
      "2007",
    ]);
  });

  it("validates required fields", () => {
    const payload = buildCardPayload(base);
    expect(validateCardPayload(payload)).toEqual([]);

    const missing = buildCardPayload({ ...base, title: "" });
    expect(validateCardPayload(missing)).toContain("title");
  });
});
