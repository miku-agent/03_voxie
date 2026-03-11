"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentAuthoredProfile } from "@/lib/authored-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireDeckId(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase가 아직 연결되지 않았어요. 반응 저장은 잠시 후 다시 시도해 주세요." } as const;
  }

  const { data: deck, error } = await (supabase.from("decks") as any).select("id").eq("slug", slug).maybeSingle();

  if (error || !deck) {
    return { error: "대상 덱을 찾지 못했어요." } as const;
  }

  return { supabase, deckId: deck.id } as const;
}

export async function toggleDeckLike(slug: string) {
  const authored = await requireCurrentAuthoredProfile();
  if ("error" in authored) {
    return { success: false, error: authored.error };
  }

  const resolved = await requireDeckId(slug);
  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  const { supabase, deckId } = resolved;
  const { data: existing } = await (supabase.from("deck_likes") as any)
    .select("id")
    .eq("deck_id", deckId)
    .eq("user_id", authored.identity.userId)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase.from("deck_likes") as any).delete().eq("id", existing.id);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/decks/${slug}`);
    return { success: true, liked: false };
  }

  const { error } = await (supabase.from("deck_likes") as any).insert({
    deck_id: deckId,
    user_id: authored.identity.userId,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/decks/${slug}`);
  return { success: true, liked: true };
}

export async function toggleDeckBookmark(slug: string) {
  const authored = await requireCurrentAuthoredProfile();
  if ("error" in authored) {
    return { success: false, error: authored.error };
  }

  const resolved = await requireDeckId(slug);
  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  const { supabase, deckId } = resolved;
  const { data: existing } = await (supabase.from("deck_bookmarks") as any)
    .select("id")
    .eq("deck_id", deckId)
    .eq("user_id", authored.identity.userId)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase.from("deck_bookmarks") as any).delete().eq("id", existing.id);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/decks/${slug}`);
    return { success: true, bookmarked: false };
  }

  const { error } = await (supabase.from("deck_bookmarks") as any).insert({
    deck_id: deckId,
    user_id: authored.identity.userId,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/decks/${slug}`);
  return { success: true, bookmarked: true };
}
