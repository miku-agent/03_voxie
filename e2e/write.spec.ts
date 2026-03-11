import { expect, test } from "@playwright/test";

async function expectWriteError(page: import("@playwright/test").Page, pattern: RegExp) {
  await expect(page.getByText(pattern)).toBeVisible();
}

test.describe("write flows", () => {
  test("card create validates input and surfaces save failure state", async ({ page }) => {
    await page.goto("/cards/new");

    await page.getByRole("button", { name: "[ 카드 만들기 ]" }).click();

    await expect(page.getByText("제목을 입력해줘.")).toBeVisible();
    await expect(page.getByText("캐릭터를 입력해줘.")).toBeVisible();
    await expect(page.getByText("태그를 하나 이상 입력해줘.")).toBeVisible();

    await page.getByPlaceholder("Melt").fill("Local Mode Card");
    await page.getByPlaceholder("Hatsune Miku").fill("Hatsune Miku");
    await page.getByPlaceholder("song").fill("song");
    await page.getByPlaceholder("classic, romance").fill("classic, test");

    await page.getByRole("button", { name: "[ 카드 만들기 ]" }).click();

    await expectWriteError(
      page,
      /(Supabase not configured\. Card creation is disabled in local mode\.|Failed to create card:)/
    );
    await expect(page).toHaveURL(/\/cards\/new$/);
  });

  test("deck create validates card selection and surfaces save failure state", async ({ page }) => {
    await page.goto("/decks/new");

    await page.getByRole("button", { name: "[ 덱 만들기 ]" }).click();

    await expect(page.getByText("덱 이름을 입력해줘.")).toBeVisible();
    await expect(page.getByText("카드를 최소 1개 선택해줘.")).toBeVisible();

    await page.getByPlaceholder("Classic Miku").fill("Fallback Deck");
    await page.getByLabel("Melt").check();

    await page.getByRole("button", { name: "[ 덱 만들기 ]" }).click();

    await expectWriteError(
      page,
      /(Supabase not configured\. Deck creation is disabled in local mode\.|Failed to create deck:)/
    );
    await expect(page).toHaveURL(/\/decks\/new$/);
  });

  test("deck edit keeps local data visible and surfaces save failure state", async ({ page }) => {
    await page.goto("/decks/classic-miku/edit");

    await expect(page.locator('input[value="Classic Miku"]')).toBeVisible();
    await expect(page.locator('textarea')).toHaveValue("초기 대표곡 모음");

    await page.getByLabel("Melt").uncheck();
    await page.getByRole("button", { name: "[ 변경사항 저장 ]" }).click();

    await expectWriteError(
      page,
      /(Supabase not configured\. Deck editing is disabled in local mode\.|Failed to update deck:|Deck updated but failed to add cards)/
    );
    await expect(page).toHaveURL(/\/decks\/classic-miku\/edit$/);
  });
});
