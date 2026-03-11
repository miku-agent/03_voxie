import type { Card } from "@/lib/cards";
import type { Deck } from "@/lib/decks";

export type DiscoveryLink = {
  label: string;
  href: string;
  helper?: string;
};

export const buildThemeDiscoveryLinks = (decks: Deck[]): DiscoveryLink[] => {
  const seen = new Set<string>();

  return decks
    .flatMap((deck) => deck.tags.map((tag) => ({ tag, deck })))
    .filter(({ tag }) => {
      if (seen.has(tag)) return false;
      seen.add(tag);
      return true;
    })
    .slice(0, 4)
    .map(({ tag, deck }) => ({
      label: `#${tag}`,
      href: `/decks?q=${encodeURIComponent(tag)}`,
      helper: deck.name,
    }));
};

export const buildEraDiscoveryLinks = (cards: Card[]): DiscoveryLink[] => {
  const counts = new Map<string, number>();

  cards.forEach((card) => {
    if (!card.era) return;
    counts.set(card.era, (counts.get(card.era) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([era, count]) => ({
      label: era,
      href: `/?q=${encodeURIComponent(era)}`,
      helper: `${count} cards`,
    }));
};

export const buildCuratorDiscoveryLinks = (decks: Deck[]): DiscoveryLink[] => {
  const seen = new Set<string>();

  return decks
    .filter((deck) => deck.authorHandle && deck.authorName)
    .filter((deck) => {
      if (!deck.authorHandle || seen.has(deck.authorHandle)) return false;
      seen.add(deck.authorHandle);
      return true;
    })
    .slice(0, 4)
    .map((deck) => ({
      label: deck.authorName!,
      href: `/users/${deck.authorHandle}`,
      helper: deck.shortPitch ?? deck.description,
    }));
};
