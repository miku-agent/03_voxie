/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { DeckPayload } from "@/lib/deck-form";
import { buildDeckUpdatePayload } from "@/lib/deck-edit";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createDeck(payload: DeckPayload) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: "Supabase not configured. Deck creation is disabled in local mode."
      };
    }

    const slug = generateSlug(payload.name) + '-' + Date.now();

    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .insert({
        slug,
        name: payload.name,
        description: payload.description,
        tags: payload.tags || [],
      } as any)
      .select()
      .single();

    if (deckError) {
      console.error("Failed to create deck:", deckError);
      return {
        success: false,
        error: "Failed to create deck: " + deckError.message
      };
    }

    if (payload.cards && payload.cards.length > 0) {
      const { data: cardData, error: cardFetchError } = await supabase
        .from("cards")
        .select("id, slug")
        .in("slug", payload.cards);

      if (cardFetchError) {
        console.error("Failed to fetch card IDs:", cardFetchError);
        return {
          success: false,
          error: "Failed to fetch card information"
        };
      }

      const cardIdMap = new Map(cardData?.map((c: any) => [c.slug, c.id]) || []);

      const deckCards = payload.cards
        .map((cardSlug, index) => ({
          deck_id: (deck as any).id,
          card_id: cardIdMap.get(cardSlug),
          position: index,
        }))
        .filter(item => item.card_id);

      if (deckCards.length > 0) {
        const { error: deckCardsError } = await supabase
          .from("deck_cards")
          .insert(deckCards as any);

        if (deckCardsError) {
          console.error("Failed to add cards to deck:", deckCardsError);
          return {
            success: false,
            error: "Deck created but failed to add cards: " + deckCardsError.message
          };
        }
      }
    }

    revalidatePath("/decks");
    revalidatePath(`/decks/${slug}`);

    return {
      success: true,
      data: {
        slug: (deck as any).slug,
        name: (deck as any).name,
      }
    };
  } catch (error) {
    console.error("Unexpected error creating deck:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
}

export async function updateDeck(deckSlug: string, input: Parameters<typeof buildDeckUpdatePayload>[0]) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: "Supabase not configured. Deck editing is disabled in local mode."
      };
    }

    const payload = buildDeckUpdatePayload(input);

    const { data: existingDeck, error: fetchError } = await supabase
      .from("decks")
      .select("id")
      .eq("slug", deckSlug)
      .single();

    if (fetchError || !existingDeck) {
      console.error("Failed to find deck:", fetchError);
      return {
        success: false,
        error: "Deck not found"
      };
    }

    const { error: updateError } = await (supabase
      .from("decks") as any)
      .update({
        name: payload.name,
        description: payload.description,
        tags: payload.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", (existingDeck as any).id);

    if (updateError) {
      console.error("Failed to update deck:", updateError);
      return {
        success: false,
        error: "Failed to update deck: " + updateError.message
      };
    }

    const { error: deleteError } = await supabase
      .from("deck_cards")
      .delete()
      .eq("deck_id", (existingDeck as any).id);

    if (deleteError) {
      console.error("Failed to remove old deck cards:", deleteError);
      return {
        success: false,
        error: "Failed to update deck cards"
      };
    }

    if (payload.cards && payload.cards.length > 0) {
      const { data: cardData, error: cardFetchError } = await supabase
        .from("cards")
        .select("id, slug")
        .in("slug", payload.cards);

      if (cardFetchError) {
        console.error("Failed to fetch card IDs:", cardFetchError);
        return {
          success: false,
          error: "Failed to fetch card information"
        };
      }

      const cardIdMap = new Map(cardData?.map((c: any) => [c.slug, c.id]) || []);

      const deckCards = payload.cards
        .map((cardSlug, index) => ({
          deck_id: (existingDeck as any).id,
          card_id: cardIdMap.get(cardSlug),
          position: index,
        }))
        .filter(item => item.card_id);

      if (deckCards.length > 0) {
        const { error: insertError } = await supabase
          .from("deck_cards")
          .insert(deckCards as any);

        if (insertError) {
          console.error("Failed to add new deck cards:", insertError);
          return {
            success: false,
            error: "Deck updated but failed to add cards"
          };
        }
      }
    }

    revalidatePath("/decks");
    revalidatePath(`/decks/${deckSlug}`);
    revalidatePath(`/decks/${deckSlug}/edit`);

    return {
      success: true,
      data: {
        slug: deckSlug,
        name: payload.name,
      }
    };
  } catch (error) {
    console.error("Unexpected error updating deck:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
}