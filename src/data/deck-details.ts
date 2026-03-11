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
  "niconico-explosion-2007": {
    shortPitch: "초기 바이럴 폭발을 빠르게 체감하게 해주는 타임캡슐형 덱.",
    introTitle: "2007년 니코니코 폭발기",
    introBody:
      "Vocaloid가 인터넷에서 어떻게 퍼지고, 어떤 카드들이 초반 대중 인지도를 밀어올렸는지 시간순 감각으로 묶은 덱이에요.",
    readingGuide:
      "초기 확산의 에너지를 느끼기 위해, 카드별 완성도보다 당시 인터넷 반응과 상징성을 먼저 떠올리며 읽어보세요.",
    curatorNote:
      "온보딩에서 '왜 이 문화가 빨리 커졌는가'를 한 번에 보여주는 쇼케이스 덱으로 설계했어요.",
    featured: true,
    authorHandle: "bini59",
    authorName: "빈이",
    cardNotes: {
      melt: {
        lead: "폭발의 기점",
        note: "초기 확산을 논할 때 가장 먼저 호출되는 대표 카드라서 시대 감각의 기준점이 됩니다.",
      },
      "world-is-mine": {
        lead: "캐릭터 소비의 가속",
        note: "곡을 넘어 캐릭터 자체가 인터넷 밈과 팬덤 담론으로 번지는 지점을 보여줘요.",
      },
      "ievan-polkka": {
        lead: "밈 확장의 증거",
        note: "짧은 루프와 밈 친화성 덕분에 플랫폼 확산성을 설명하기 좋은 마지막 카드예요.",
      },
    },
  },
  "miku-meme-starter": {
    shortPitch: "처음 보는 사람도 바로 반응할 수 있는 대중 인지도 중심의 스타터 덱.",
    introTitle: "밈에서 시작하는 미쿠 입문",
    introBody:
      "설명보다 반응이 먼저 오는 카드들로 구성해, 신규 유저가 '이건 나도 안다'는 감각에서 자연스럽게 탐색을 시작하게 만들어요.",
    readingGuide:
      "정확한 역사보다 즉시 떠오르는 이미지와 밈, 반복 재생 포인트에 집중해서 가볍게 넘겨보면 좋아요.",
    curatorNote:
      "홈 첫인상에서 부담 없이 눌러볼 수 있는 온보딩 카드 묶음이 필요해서 만든 덱이에요.",
    featured: false,
    authorHandle: "miku",
    authorName: "初音ミク",
    cardNotes: {
      "world-is-mine": {
        lead: "캐릭터 밈의 중심",
        note: "미쿠의 캐릭터성을 가장 대중적으로 각인시킨 카드라 스타터 덱의 첫머리에 잘 맞아요.",
      },
      "ievan-polkka": {
        lead: "반복되는 인터넷 기억",
        note: "짧고 강한 밈 회전력 덕분에 신규 유저에게도 즉시 설명이 통하는 카드예요.",
      },
      melt: {
        lead: "밈에서 대표곡으로",
        note: "밈 기반 진입 이후, 왜 대표곡 아카이브로 더 깊게 들어가야 하는지 자연스럽게 연결해줍니다.",
      },
    },
  },
  "emotion-arc": {
    shortPitch: "감정선의 상승과 침잠을 따라가며 읽는 스토리형 큐레이션.",
    introTitle: "감정선으로 묶은 미쿠 서사",
    introBody:
      "단순 인기순이 아니라 정서의 흐름을 따라 묶어, 덱이 하나의 읽기 경험이 될 수 있다는 점을 보여주는 예시예요.",
    readingGuide:
      "각 카드의 정보량보다 앞 카드의 감정이 다음 카드에서 어떻게 변주되는지에 집중해보세요.",
    curatorNote:
      "Voxie가 단순 데이터베이스가 아니라 '읽는 순서를 설계하는 제품'임을 보여주기 위해 만든 실험적인 덱이에요.",
    featured: false,
    authorHandle: "bini59",
    authorName: "빈이",
    cardNotes: {
      melt: {
        lead: "설렘의 출발",
        note: "밝고 선명한 감정에서 시작하면 뒤 카드들의 대비가 더 선명하게 느껴져요.",
      },
      "rolling-girl": {
        lead: "감정의 심화",
        note: "중간 지점에서 서사를 깊게 눌러주며 덱 전체의 온도를 바꿔주는 역할을 합니다.",
      },
      "reverse-rainbow": {
        lead: "잔향의 정리",
        note: "마지막에는 감정을 완전히 끊지 않고 여운으로 정리해 다시 탐색으로 이어지게 만들어요.",
      },
    },
  },
};
