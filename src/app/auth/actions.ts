"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMockAuthEnabled, MOCK_AUTH_COOKIE } from "@/lib/mock-auth";

export async function signOut() {
  if (isMockAuthEnabled()) {
    const cookieStore = await cookies();
    cookieStore.set(MOCK_AUTH_COOKIE, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
  }

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
