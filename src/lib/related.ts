import type { Card } from "@/lib/cards";
import type { Deck } from "@/lib/decks";

const intersectionCount = (left: string[], right: string[]) => {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
};

export const getRelatedDecks = (target: Deck, allDecks: Deck[], limit = 3) => {
  return allDecks
    .filter((deck) => deck.slug !== target.slug)
    .map((deck) => {
      const sharedTags = intersectionCount(target.tags, deck.tags);
      const sharedCards = intersectionCount(target.cards, deck.cards);
      const sameAuthor = target.authorHandle && deck.authorHandle && target.authorHandle === deck.authorHandle ? 1 : 0;
      const score = sharedTags * 3 + sharedCards * 4 + sameAuthor * 2;

      return { deck, score, sharedTags, sharedCards };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.sharedCards - a.sharedCards || b.sharedTags - a.sharedTags || a.deck.name.localeCompare(b.deck.name))
    .slice(0, limit)
    .map((item) => item.deck);
};

export const getRelatedCards = (target: Card, allCards: Card[], limit = 4) => {
  return allCards
    .filter((card) => card.slug !== target.slug)
    .map((card) => {
      const sharedTags = intersectionCount(target.tags, card.tags);
      const sameProducer = target.producer && card.producer && target.producer === card.producer ? 1 : 0;
      const sameEra = target.era && card.era && target.era === card.era ? 1 : 0;
      const sameCharacter = target.character === card.character ? 1 : 0;
      const score = sharedTags * 3 + sameProducer * 3 + sameEra * 2 + sameCharacter * 2;

      return { card, score, sharedTags, sameProducer, sameEra, sameCharacter };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.sharedTags - a.sharedTags ||
        b.sameProducer - a.sameProducer ||
        b.sameEra - a.sameEra ||
        b.sameCharacter - a.sameCharacter ||
        a.card.title.localeCompare(b.card.title),
    )
    .slice(0, limit)
    .map((item) => item.card);
};
