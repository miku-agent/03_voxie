/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { CardPayload } from "@/lib/card-form";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createCard(payload: CardPayload) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: "Supabase not configured. Card creation is disabled in local mode."
      };
    }

    const slug = generateSlug(payload.title) + '-' + Date.now();

    const { data, error } = await supabase
      .from("cards")
      .insert({
        slug,
        title: payload.title,
        type: payload.type,
        character: payload.character,
        tags: payload.tags,
        source_url: payload.source_url,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Failed to create card:", error);
      return {
        success: false,
        error: "Failed to create card: " + error.message
      };
    }

    revalidatePath("/");
    revalidatePath("/cards");

    return {
      success: true,
      data: {
        slug: (data as any).slug,
        title: (data as any).title,
      }
    };
  } catch (error) {
    console.error("Unexpected error creating card:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
}