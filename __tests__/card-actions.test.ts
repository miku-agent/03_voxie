import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath,
}));

describe("card actions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns a local mode error when Supabase is not configured", async () => {
    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => false,
      supabase: null,
    }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({
          user: { id: "user-1" },
          identity: { userId: "user-1", handle: "bini59", name: "빈이" },
        }),
    }));

    const { createCard } = await import("@/lib/actions/cards");

    await expect(
      createCard({
        title: "Melt",
        character: "Hatsune Miku",
        type: "song",
        tags: ["classic"],
      })
    ).resolves.toEqual({
      success: false,
      error: "Supabase not configured. Card creation is disabled in local mode.",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("creates a card and revalidates list pages", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);

    const single = vi.fn().mockResolvedValue({
      data: { slug: "melt-1234567890", title: "Melt" },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));

    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => true,
      supabase: { from },
    }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({
          user: { id: "user-1" },
          identity: { userId: "user-1", handle: "bini59", name: "빈이" },
        }),
    }));

    const { createCard } = await import("@/lib/actions/cards");

    const result = await createCard({
      title: "Melt",
      character: "Hatsune Miku",
      type: "song",
      tags: ["classic", "romance"],
      source_url: "https://example.com",
      youtube_url: "https://www.youtube.com/watch?v=o1jAMSQyVPc",
    });

    expect(from).toHaveBeenCalledWith("cards");
    expect(insert).toHaveBeenCalledWith({
      slug: "melt-1234567890",
      title: "Melt",
      type: "song",
      character: "Hatsune Miku",
      tags: ["classic", "romance"],
      source_url: "https://example.com",
      youtube_url: "https://www.youtube.com/watch?v=o1jAMSQyVPc",
      owner_user_id: "user-1",
      author_handle: "bini59",
      author_name: "빈이",
    });
    expect(result).toEqual({
      success: true,
      data: {
        slug: "melt-1234567890",
        title: "Melt",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/cards");
  });

  it("returns a Supabase error message when insert fails", async () => {
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "duplicate key value violates unique constraint" },
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));

    vi.doMock("@/lib/supabase/client", () => ({
      isSupabaseConfigured: () => true,
      supabase: { from },
    }));
    vi.doMock("@/lib/authored-content", () => ({
      requireCurrentAuthoredProfile: () =>
        Promise.resolve({
          user: { id: "user-1" },
          identity: { userId: "user-1", handle: "bini59", name: "빈이" },
        }),
    }));

    const { createCard } = await import("@/lib/actions/cards");

    await expect(
      createCard({
        title: "Melt",
        character: "Hatsune Miku",
        type: "song",
        tags: ["classic"],
      })
    ).resolves.toEqual({
      success: false,
      error: "Failed to create card: duplicate key value violates unique constraint",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
