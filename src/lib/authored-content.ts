import { getCurrentUser } from "@/lib/auth";
import { getAuthoredProfileIdentity } from "@/lib/auth-profile";

export async function requireCurrentAuthoredProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: "로그인이 필요해요. 먼저 Voxie 계정으로 로그인해 주세요.",
    } as const;
  }

  return {
    user,
    identity: getAuthoredProfileIdentity(user),
  } as const;
}
