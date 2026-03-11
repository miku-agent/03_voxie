export type DeckSocialMeta = {
  likes: number;
  bookmarks: number;
};

export type ProfileSocialMeta = {
  followers: number;
};

const deckSocialSeed: Record<string, DeckSocialMeta> = {
  "classic-miku": { likes: 128, bookmarks: 44 },
  "stage-hits": { likes: 97, bookmarks: 31 },
  "niconico-explosion-2007": { likes: 76, bookmarks: 29 },
  "miku-meme-starter": { likes: 63, bookmarks: 25 },
  "emotion-arc": { likes: 54, bookmarks: 22 },
};

const profileSocialSeed: Record<string, ProfileSocialMeta> = {
  bini59: { followers: 142 },
  miku: { followers: 256 },
};

export const getDeckSocialMeta = (slug: string): DeckSocialMeta => {
  return deckSocialSeed[slug] ?? { likes: 0, bookmarks: 0 };
};

export const getProfileSocialMeta = (handle: string): ProfileSocialMeta => {
  return profileSocialSeed[handle] ?? { followers: 0 };
};
