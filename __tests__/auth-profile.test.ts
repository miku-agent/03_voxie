import { describe, expect, it } from "vitest";
import { getAuthoredProfileIdentity, sanitizeProfileHandle } from "@/lib/auth-profile";

describe("auth profile identity", () => {
  it("derives a stable handle and name from auth metadata", () => {
    const identity = getAuthoredProfileIdentity({
      id: "user-12345678",
      email: "bini59@example.com",
      user_metadata: {
        user_name: "Bini_59",
        full_name: "빈이",
      },
    } as never);

    expect(identity).toEqual({
      userId: "user-12345678",
      handle: "bini_59",
      name: "빈이",
    });
  });

  it("sanitizes handles into profile-safe slugs", () => {
    expect(sanitizeProfileHandle("  Hello Voxie! Curator  ")).toBe("hello-voxie-curator");
  });
});
