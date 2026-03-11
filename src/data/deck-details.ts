export type DeckCardNote = {
  lead?: string;
  note?: string;
};

export type DeckDetailSeed = {
  shortPitch?: string;
  introTitle?: string;
  introBody?: string;
  readingGuide?: string;
  curatorNote?: string;
  featured?: boolean;
  authorHandle?: string;
  authorName?: string;
  cardNotes?: Record<string, DeckCardNote>;
};

export const deckDetails: Record<string, DeckDetailSeed> = {
  "classic-miku": {
    shortPitch: "처음 Voxie에 들어온 사람이 서비스 가치를 바로 이해하게 해주는 입문용 덱.",
    introTitle: "초기 미쿠 클래식의 입문 서사",
    introBody:
      "이 덱은 단순히 유명곡을 모아놓은 리스트가 아니라, 보컬로이드 문화에서 '어떤 카드부터 읽으면 전체 맥락이 잡히는가'를 안내하는 첫 번째 독서 순서예요.",
    readingGuide:
      "앞쪽 카드는 시대의 기준점을, 뒤쪽 카드는 감정과 분위기의 확장을 보여주도록 배치했어요. 순서대로 읽으면 미쿠 초창기 인상이 어떻게 넓어졌는지 자연스럽게 따라갈 수 있어요.",
    curatorNote:
      "초기 미쿠 대표곡을 한 번에 묶어 '카드를 왜 덱으로 엮는가'를 가장 직관적으로 보여주는 큐레이션이에요.",
    featured: true,
    authorHandle: "bini59",
    authorName: "빈이",
    cardNotes: {
      melt: {
        lead: "시작점",
        note: "Melt는 보컬로이드 입문자에게 가장 먼저 보여주기 좋은 카드예요. 감정 전달과 대중성이 모두 분명해서 덱의 첫 인상을 안정적으로 잡아줍니다.",
      },
      "world-is-mine": {
        lead: "캐릭터의 확장",
        note: "World is Mine으로 넘어가면 곡 자체를 넘어서 팬덤이 어떤 캐릭터 이미지를 사랑했는지 읽을 수 있어요. 아카이브가 문화 기록이 되는 지점이죠.",
      },
      "rolling-girl": {
        lead: "감정선의 심화",
        note: "마지막으로 Rolling Girl을 두어, 대표곡 리스트가 단순 밝은 히트곡 모음이 아니라 더 깊은 감정과 해석으로 이어진다는 걸 보여줘요.",
      },
    },
  },
  "stage-hits": {
    shortPitch: "라이브와 퍼포먼스 맥락으로 다시 보는 카드 묶음.",
    introTitle: "무대 기억으로 읽는 Voxie 덱",
    introBody:
      "같은 카드도 공연에서 소비된 방식, 팬이 떠올리는 장면, 반복되는 콜과 밈에 따라 전혀 다른 의미를 가져요. 이 덱은 그 '무대의 기억'을 따라 읽도록 구성했어요.",
    readingGuide:
      "스튜디오 버전보다 라이브 반응과 퍼포먼스 이미지를 먼저 떠올리며 읽으면 이 덱의 흐름이 더 잘 보입니다.",
    curatorNote:
      "같은 곡도 공연과 밈의 기억으로 다시 읽히기 때문에, 덱은 단순 목록이 아니라 맥락을 담는 단위가 됩니다.",
    featured: true,
    authorHandle: "miku",
    authorName: "初音ミク",
    cardNotes: {
      melt: {
        lead: "오프닝의 안정감",
        note: "잘 알려진 곡으로 시작해 공연 세트의 진입 장벽을 낮추고, 모두가 알고 있는 카드에서 공통 감각을 맞춰요.",
      },
      "ievan-polkka": {
        lead: "밈과 참여",
        note: "Ievan Polkka는 관객이 즉시 반응할 수 있는 참여형 기억을 불러와요. 라이브 체감과 인터넷 밈이 만나는 포인트예요.",
      },
      "reverse-rainbow": {
        lead: "잔상의 마무리",
        note: "후반부에 더 감성적인 카드를 두어 공연 후에도 남는 정서를 정리하게 만들어요. 이 배치 덕분에 덱이 세트리스트처럼 읽혀요.",
      },
    },
  },
};
