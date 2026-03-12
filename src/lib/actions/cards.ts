/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CardPayload } from "@/lib/card-form";
import { requireCurrentAuthoredProfile } from "@/lib/authored-content";
import { insertMockCard, isMockWriteModeEnabled } from "@/lib/mock-db";

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function createCard(payload: CardPayload) {
  try {
    const slug = generateSlug(payload.title) + "-" + Date.now();
    const authored = await requireCurrentAuthoredProfile();

    if ("error" in authored) {
      return {
        success: false,
        error: authored.error,
      };
    }

    if (isMockWriteModeEnabled()) {
      insertMockCard({
        slug,
        title: payload.title,
        type: payload.type,
        character: payload.character,
        tags: payload.tags,
        source_url: payload.source_url,
        youtube_url: payload.youtube_url,
        ownerUserId: authored.identity.userId,
        authorHandle: authored.identity.handle,
        authorName: authored.identity.name,
      });

      revalidatePath("/");
      revalidatePath("/cards");

      return {
        success: true,
        data: {
          slug,
          title: payload.title,
        },
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Supabase not configured. Card creation is disabled in local mode.",
      };
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured. Card creation is disabled in local mode.",
      };
    }

    const { data, error } = await supabase
      .from("cards")
      .insert({
        slug,
        title: payload.title,
        type: payload.type,
        character: payload.character,
        tags: payload.tags,
        source_url: payload.source_url,
        youtube_url: payload.youtube_url,
        owner_user_id: authored.identity.userId,
        author_handle: authored.identity.handle,
        author_name: authored.identity.name,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Failed to create card:", error);
      return {
        success: false,
        error: "Failed to create card: " + error.message,
      };
    }

    revalidatePath("/");
    revalidatePath("/cards");

    return {
      success: true,
      data: {
        slug: (data as any).slug,
        title: (data as any).title,
      },
    };
  } catch (error) {
    console.error("Unexpected error creating card:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
