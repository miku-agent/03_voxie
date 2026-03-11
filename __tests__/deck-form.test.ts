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
  intro: "초기 미쿠의 흐름을 읽는 입문 덱",
  curatorNote: "곡 간의 시대 감각 차이를 따라가며 읽어주세요.",
};

describe("deck form helpers", () => {
  it("parses tags from comma-separated string", () => {
    expect(parseDeckTags("classic, miku")).toEqual(["classic", "miku"]);
  });

  it("builds intro and curator note fields", () => {
    expect(buildDeckPayload(base)).toEqual({
      name: "Classic Miku",
      tags: ["classic", "miku"],
      cards: ["melt", "world-is-mine"],
      description: "대표곡 모음",
      intro: "초기 미쿠의 흐름을 읽는 입문 덱",
      curatorNote: "곡 간의 시대 감각 차이를 따라가며 읽어주세요.",
    });
  });

  it("validates required fields", () => {
    const payload = buildDeckPayload(base);
    expect(validateDeckPayload(payload)).toEqual([]);

    const missing = buildDeckPayload({ ...base, name: "" });
    expect(validateDeckPayload(missing)).toContain("name");
  });
});
