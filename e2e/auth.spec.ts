import { expect, test } from "@playwright/test";

test.describe("auth flows", () => {
  test("email signup, signout, signin, and redirect recovery work in mock auth mode", async ({ page }) => {
    await page.goto("/cards/new");
    await expect(page).toHaveURL(/\/auth\?redirectedFrom=%2Fcards%2Fnew$/);

    await page.getByRole("button", { name: "회원가입" }).first().click();
    await page.getByPlaceholder("you@voxie.dev").fill("new-user@voxie.dev");
    await page.getByPlaceholder("8자 이상").fill("password123");
    await page.locator("form").getByRole("button", { name: "회원가입" }).click();

    await expect(page).toHaveURL(/\/cards\/new$/);
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();

    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "로그인" })).toBeVisible();

    await page.goto("/auth?redirectedFrom=/decks/new");
    await page.getByPlaceholder("you@voxie.dev").fill("returning-user@voxie.dev");
    await page.getByPlaceholder("8자 이상").fill("password123");
    await page.locator("form").getByRole("button", { name: /^로그인$/ }).click();

    await expect(page).toHaveURL(/\/decks\/new$/);
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  });

  test("google social login completes through callback mock", async ({ page }) => {
    await page.goto("/auth?redirectedFrom=/decks/new");
    await page.getByRole("button", { name: /Google로 로그인/ }).click();

    await expect(page).toHaveURL(/\/decks\/new$/);
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  });

  test("kakao social CTA is exposed in mock mode and completes callback", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: /카카오로 로그인/ }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  });

  test("callback errors are surfaced on auth page", async ({ page }) => {
    await page.goto("/auth/callback?error=access_denied&error_description=User%20cancelled%20authorization");

    await expect(page).toHaveURL(/\/auth\?error=User%20cancelled%20authorization$/);
    await expect(page.getByText("오류: User cancelled authorization")).toBeVisible();
  });
});
