import type { User } from "@supabase/supabase-js";

export type AuthoredProfileIdentity = {
  userId: string;
  handle: string;
  name: string;
};

export function sanitizeProfileHandle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function getAuthoredProfileIdentity(user: User): AuthoredProfileIdentity {
  const metadata = user.user_metadata ?? {};
  const emailPrefix = user.email?.split("@")[0] ?? "curator";
  const rawHandle =
    metadata.user_name ?? metadata.username ?? metadata.handle ?? metadata.preferred_username ?? emailPrefix;
  const rawName = metadata.full_name ?? metadata.name ?? rawHandle ?? emailPrefix;

  return {
    userId: user.id,
    handle: sanitizeProfileHandle(String(rawHandle)) || `user-${user.id.slice(0, 8)}`,
    name: String(rawName).trim() || "Voxie Curator",
  };
}
