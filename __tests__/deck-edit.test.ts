import { describe, expect, it } from "vitest";
import { buildDeckUpdatePayload, validateDeckUpdatePayload } from "@/lib/deck-edit";

const base = {
  name: "Classic Miku",
  description: "대표곡 모음",
  tags: ["classic", "miku"],
  cards: ["melt", "world-is-mine"],
};

describe("deck edit helpers", () => {
  it("builds normalized payload", () => {
    const payload = buildDeckUpdatePayload({
      ...base,
      name: "  Classic Miku  ",
      tags: ["classic", "miku", ""],
    });

    expect(payload.name).toBe("Classic Miku");
    expect(payload.tags).toEqual(["classic", "miku"]);
  });

  it("requires name and at least one card", () => {
    expect(validateDeckUpdatePayload(buildDeckUpdatePayload(base))).toEqual([]);

    expect(
      validateDeckUpdatePayload(
        buildDeckUpdatePayload({ ...base, name: "", cards: [] })
      )
    ).toEqual(["name", "cards"]);
  });
});
