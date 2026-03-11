export type CardDetailSeed = {
  summary: string;
  description: string[];
  producer?: string;
  year?: number;
  era?: string;
  mood?: string[];
  whyItMatters?: string;
  youtube_url?: string;
  authorHandle?: string;
  authorName?: string;
};

export const cardDetails: Record<string, CardDetailSeed> = {
  melt: {
    summary: "초기 미쿠 붐을 대표하는 러브송 클래식.",
    description: [
      "Melt는 보컬로이드가 단순 실험작이 아니라 대중적으로 사랑받는 팝송이 될 수 있다는 걸 보여준 상징적인 곡이에요.",
      "직설적인 감정 표현과 밝은 멜로디 덕분에 입문자에게도 설명하기 쉬운 카드이고, 초기 니코동 시대의 열기를 떠올리게 하는 기준점 역할도 해요.",
    ],
    producer: "ryo (supercell)",
    year: 2007,
    era: "NicoNico golden age",
    mood: ["bright", "romance", "classic"],
    whyItMatters: "Voxie에서 카드로 남길 가치가 분명한 '시대의 기준점' 같은 곡이에요.",
    youtube_url: "https://www.youtube.com/watch?v=o1jAMSQyVPc",
    authorHandle: "bini59",
    authorName: "빈이",
  },
  "world-is-mine": {
    summary: "미쿠 캐릭터성을 대중적으로 각인시킨 아이코닉 트랙.",
    description: [
      "World is Mine은 '공주님 같은 미쿠'라는 팬덤 이미지를 폭발적으로 확산시킨 대표곡이에요.",
      "곡 자체의 인지도도 높지만, 공연 연출과 팬덤 밈까지 포함해 다양한 모먼트를 덱으로 연결하기 좋은 카드예요.",
    ],
    producer: "ryo (supercell)",
    year: 2008,
    era: "Character-defining classics",
    mood: ["playful", "iconic", "performance"],
    whyItMatters: "단일 곡을 넘어 캐릭터 해석과 무대 연출의 출발점이 되는 카드예요.",
    authorHandle: "bini59",
    authorName: "빈이",
  },
  "rolling-girl": {
    summary: "강한 질주감과 불안한 감정선이 겹치는 wowaka 대표곡.",
    description: [
      "Rolling Girl은 속도감 있는 록 사운드와 반복되는 정서가 겹치면서, 듣는 순간 강한 감정 잔상을 남기는 곡이에요.",
      "Voxie에서는 단순 곡 정보보다도 '왜 사람들이 이 곡을 계속 기억하는지'를 기록하기 좋은 카드로 기능할 수 있어요.",
    ],
    producer: "wowaka",
    year: 2010,
    era: "Band sound / emotional classics",
    mood: ["restless", "cathartic", "rock"],
    whyItMatters: "개별 카드만으로도 설명과 감상을 읽을 이유가 생기는 대표 사례예요.",
    youtube_url: "https://youtu.be/vnw8zURAxkU",
    authorHandle: "miku",
    authorName: "初音ミク",
  },
  "ievan-polkka": {
    summary: "밈과 퍼포먼스로 폭발적으로 확산된 초기 바이럴 미쿠 카드.",
    description: [
      "Ievan Polkka는 곡 자체보다도 '파 돌리기' 같은 문화적 밈과 함께 회자되는, 인터넷적 확산력을 상징하는 카드예요.",
      "덕분에 카드 아카이브 안에서도 음악·밈·캐릭터 이미지가 어떻게 합쳐졌는지 보여주는 좋은 연결점이 됩니다.",
    ],
    producer: "Otomania arrangement / cover culture",
    year: 2007,
    era: "Viral internet moments",
    mood: ["meme", "playful", "folk"],
    whyItMatters: "곡 그 자체뿐 아니라 팬덤 문화의 전파 경로까지 묶어 보여주기 좋아요.",
    authorHandle: "miku",
    authorName: "初音ミク",
  },
  "reverse-rainbow": {
    summary: "무드와 하모니를 중심으로 기억되는 감성 듀엣 카드.",
    description: [
      "Reverse Rainbow는 폭발적인 대표곡 계열과는 조금 다르게, 감성적인 톤과 조합의 매력으로 기억되는 카드예요.",
      "이런 카드가 있어야 Voxie가 '유명곡 목록'을 넘어 개인적 취향과 분위기 큐레이션이 가능한 아카이브로 보이게 됩니다.",
    ],
    producer: "Treow (electrosphere)",
    year: 2009,
    era: "Atmospheric duet picks",
    mood: ["dreamy", "duet", "late-night"],
    whyItMatters: "덱 기능이 단순 분류가 아니라 분위기 큐레이션이라는 걸 보여주는 카드예요.",
    authorHandle: "bini59",
    authorName: "빈이",
  },
};
