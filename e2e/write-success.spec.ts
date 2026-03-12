import { expect, test } from "@playwright/test";
import { signInAs } from "./helpers";

test.describe("write flows success with mock persistence", () => {
  test("card create redirects home and shows created card", async ({ page }) => {
    await signInAs(page, "/cards/new");

    await page.getByPlaceholder("예: Melt").fill("Mock Persist Card");
    await page.getByPlaceholder("예: Hatsune Miku").fill("Hatsune Miku");
    await page.getByPlaceholder("예: classic, romance, live").fill("mock, success");

    await page.getByRole("button", { name: "카드 저장" }).click();

    await expect(page).toHaveURL(/\/?created=card$/);
    await expect(page.getByRole("link", { name: "Mock Persist Card" })).toBeVisible();
  });

  test("deck create redirects to detail page and shows selected cards", async ({ page }) => {
    await signInAs(page, "/decks/new");

    await page.getByPlaceholder("예: Classic Miku").fill("Mock Persist Deck");
    await page.getByPlaceholder("이 덱이 어떤 흐름과 분위기를 묶는지 적어주세요").fill("테스트용 mock deck");
    await page.getByPlaceholder("예: classic, miku, emotional").fill("mock, success");
    await page.getByLabel("Melt").check();
    await page.getByLabel("World is Mine").check();

    await page.getByRole("button", { name: "덱 저장" }).click();

    await expect(page).toHaveURL(/\/decks\/mock-persist-deck-\d+\?created=deck$/);
    await expect(page.getByRole("heading", { name: "Mock Persist Deck" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Melt" })).toBeVisible();
    await expect(page.getByRole("link", { name: "World is Mine", exact: true })).toBeVisible();
  });

  test("deck edit saves changes and reflects them on detail page", async ({ page }) => {
    await signInAs(page, "/decks/classic-miku/edit");

    await page.locator("input").first().fill("Classic Miku Updated");
    await page.locator("textarea").first().fill("수정된 mock 설명");
    await page.getByLabel("Rolling Girl").check();

    await page.getByRole("button", { name: "변경사항 저장" }).click();

    await expect(page).toHaveURL(/\/decks\/classic-miku$/);
    await expect(page.getByRole("heading", { name: "Classic Miku Updated" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Rolling Girl", exact: true })).toBeVisible();
  });
});
