export type DeckDetailSeed = {
  shortPitch?: string;
  curatorNote?: string;
  featured?: boolean;
  authorHandle?: string;
  authorName?: string;
};

export const deckDetails: Record<string, DeckDetailSeed> = {
  "classic-miku": {
    shortPitch: "처음 Voxie에 들어온 사람이 서비스 가치를 바로 이해하게 해주는 입문용 덱.",
    curatorNote:
      "초기 미쿠 대표곡을 한 번에 묶어 '카드를 왜 덱으로 엮는가'를 가장 직관적으로 보여주는 큐레이션이에요.",
    featured: true,
    authorHandle: "bini59",
    authorName: "빈이",
  },
  "stage-hits": {
    shortPitch: "라이브와 퍼포먼스 맥락으로 다시 보는 카드 묶음.",
    curatorNote:
      "같은 곡도 공연과 밈의 기억으로 다시 읽히기 때문에, 덱은 단순 목록이 아니라 맥락을 담는 단위가 됩니다.",
    featured: true,
    authorHandle: "miku",
    authorName: "初音ミク",
  },
};
