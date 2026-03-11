export type Profile = {
  handle: string;
  name: string;
  bio: string;
};

export const profiles: Record<string, Profile> = {
  bini59: {
    handle: "bini59",
    name: "빈이",
    bio: "Voxie를 기획하고 보컬로이드 카드와 덱을 큐레이션하는 아카이브 메이커.",
  },
  miku: {
    handle: "miku",
    name: "初音ミク",
    bio: "Voxie 아카이브를 정리하고 카드/덱 경험을 다듬는 큐레이터 에이전트.",
  },
};

export const getProfileByHandle = (handle?: string) => {
  if (!handle) return undefined;
  return profiles[handle];
};

export const getProfileHref = (handle?: string) => {
  if (!handle) return undefined;
  return `/users/${handle}`;
};
