import seedCards from "@/data/seed.json";
import seedDecks from "@/data/decks.json";
import type { Card } from "@/lib/cards";
import type { Deck } from "@/lib/decks";

const MOCK_DB_FLAG = "PLAYWRIGHT_WRITE_THROUGH_MOCK";

type MockDb = {
  cards: Card[];
  decks: Deck[];
};

declare global {
  // eslint-disable-next-line no-var
  var __voxieMockDb: MockDb | undefined;
}

function cloneCards(): Card[] {
  return (seedCards as Card[]).map((card) => ({ ...card, tags: [...card.tags] }));
}

function cloneDecks(): Deck[] {
  return (seedDecks as Deck[]).map((deck) => ({
    ...deck,
    tags: [...deck.tags],
    cards: [...deck.cards],
  }));
}

export function isMockWriteModeEnabled() {
  return process.env[MOCK_DB_FLAG] === "1";
}

export function getMockDb(): MockDb {
  if (!globalThis.__voxieMockDb) {
    globalThis.__voxieMockDb = {
      cards: cloneCards(),
      decks: cloneDecks(),
    };
  }

  return globalThis.__voxieMockDb;
}

export function listMockCards() {
  return getMockDb().cards.map((card) => ({ ...card, tags: [...card.tags] }));
}

export function listMockDecks() {
  return getMockDb().decks.map((deck) => ({
    ...deck,
    tags: [...deck.tags],
    cards: [...deck.cards],
  }));
}

export function insertMockCard(card: Card) {
  const db = getMockDb();
  db.cards.unshift({ ...card, tags: [...card.tags] });
  return card;
}

export function insertMockDeck(deck: Deck) {
  const db = getMockDb();
  db.decks.unshift({ ...deck, tags: [...deck.tags], cards: [...deck.cards] });
  return deck;
}

export function updateMockDeck(slug: string, patch: Omit<Deck, "slug">) {
  const db = getMockDb();
  const index = db.decks.findIndex((deck) => deck.slug === slug);
  if (index === -1) return null;

  db.decks[index] = {
    slug,
    name: patch.name,
    description: patch.description,
    tags: [...patch.tags],
    cards: [...patch.cards],
  };

  return db.decks[index];
}
