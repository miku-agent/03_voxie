import { expect, test } from "@playwright/test";

test.describe("write flows success with mock persistence", () => {
  test("card create redirects home and shows created card", async ({ page }) => {
    await page.goto("/cards/new");

    await page.getByPlaceholder("Melt").fill("Mock Persist Card");
    await page.getByPlaceholder("Hatsune Miku").fill("Hatsune Miku");
    await page.getByPlaceholder("song").fill("song");
    await page.getByPlaceholder("classic, romance").fill("mock, success");

    await page.getByRole("button", { name: "[ 카드 만들기 ]" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Mock Persist Card" })).toBeVisible();
  });

  test("deck create redirects to detail page and shows selected cards", async ({ page }) => {
    await page.goto("/decks/new");

    await page.getByPlaceholder("Classic Miku").fill("Mock Persist Deck");
    await page.getByPlaceholder("덱 소개를 적어줘").fill("테스트용 mock deck");
    await page.getByPlaceholder("classic, miku").fill("mock, success");
    await page.getByLabel("Melt").check();
    await page.getByLabel("World is Mine").check();

    await page.getByRole("button", { name: "[ 덱 만들기 ]" }).click();

    await expect(page).toHaveURL(/\/decks\/mock-persist-deck-\d+$/);
    await expect(page.getByRole("heading", { name: "Mock Persist Deck" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Melt" })).toBeVisible();
    await expect(page.getByRole("link", { name: "World is Mine" })).toBeVisible();
  });

  test("deck edit saves changes and reflects them on detail page", async ({ page }) => {
    await page.goto("/decks/classic-miku/edit");

    await page.locator('input[value="Classic Miku"]').fill("Classic Miku Updated");
    await page.locator("textarea").fill("수정된 mock 설명");
    await page.getByLabel("Rolling Girl").check();

    await page.getByRole("button", { name: "[ 변경사항 저장 ]" }).click();

    await expect(page).toHaveURL(/\/decks\/classic-miku$/);
    await expect(page.getByRole("heading", { name: "Classic Miku Updated" })).toBeVisible();
    await expect(page.getByText("수정된 mock 설명")).toBeVisible();
    await expect(page.getByRole("link", { name: "Rolling Girl" })).toBeVisible();
  });
});
