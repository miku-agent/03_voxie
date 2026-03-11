import { describe, expect, it } from "vitest";
import {
  buildDeckPayload,
  parseDeckTags,
  validateDeckPayload,
} from "@/lib/deck-form";

const base = {
  name: "Classic Miku",
  tags: "classic, miku",
  cards: ["melt", "world-is-mine"],
  description: "대표곡 모음",
};

describe("deck form helpers", () => {
  it("parses tags from comma-separated string", () => {
    expect(parseDeckTags("classic, miku")).toEqual(["classic", "miku"]);
  });

  it("validates required fields", () => {
    const payload = buildDeckPayload(base);
    expect(validateDeckPayload(payload)).toEqual([]);

    const missing = buildDeckPayload({ ...base, name: "" });
    expect(validateDeckPayload(missing)).toContain("name");
  });
});
