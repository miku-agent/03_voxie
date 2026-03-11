import { getAuthoredProfileIdentity } from "@/lib/auth-profile";
import { getCurrentUser } from "@/lib/auth";
import { listCards } from "@/lib/cards";
import { listDecks } from "@/lib/decks";

export type Profile = {
  handle: string;
  name: string;
  bio?: string;
};

const profiles: Profile[] = [
  {
    handle: "bini59",
    name: "빈이",
    bio: "Voxie를 조율하는 마스터. deck-first curator flow를 만드는 중.",
  },
  {
    handle: "miku",
    name: "初音ミク",
    bio: "카드와 덱을 엮어 흐름을 만드는 큐레이터 에이전트.",
  },
];

export function getProfileHref(handle?: string) {
  if (!handle) return undefined;
  return `/users/${handle}`;
}

async function getDynamicProfiles(): Promise<Profile[]> {
  const [cards, decks, currentUser] = await Promise.all([listCards(), listDecks(), getCurrentUser()]);
  const profileMap = new Map(profiles.map((profile) => [profile.handle, profile]));

  for (const item of [...cards, ...decks]) {
    if (!item.authorHandle || !item.authorName) continue;
    if (!profileMap.has(item.authorHandle)) {
      profileMap.set(item.authorHandle, {
        handle: item.authorHandle,
        name: item.authorName,
        bio: "Voxie에서 카드를 모으고 덱을 큐레이션하는 사용자예요.",
      });
    }
  }

  if (currentUser) {
    const identity = getAuthoredProfileIdentity(currentUser);
    profileMap.set(identity.handle, {
      handle: identity.handle,
      name: identity.name,
      bio: currentUser.email ? `${currentUser.email}로 Voxie를 사용하는 큐레이터예요.` : "Voxie에 로그인한 큐레이터예요.",
    });
  }

  return [...profileMap.values()];
}

export async function getProfileByHandle(handle: string) {
  const allProfiles = await getDynamicProfiles();
  return allProfiles.find((profile) => profile.handle === handle);
}

export async function listProfiles() {
  return getDynamicProfiles();
}
