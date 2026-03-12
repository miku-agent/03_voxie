import { expect, test } from "@playwright/test";
import { signInAs } from "./helpers";

test.describe("write form validation", () => {
  test("card create requires required fields", async ({ page }) => {
    await signInAs(page, "/cards/new");

    await page.getByRole("button", { name: "카드 저장" }).click();

    await expect(page.getByText("제목을 입력해줘.")).toBeVisible();
    await expect(page.getByText("캐릭터를 입력해줘.")).toBeVisible();
    await expect(page.getByText("태그를 하나 이상 입력해줘.")).toBeVisible();
    await expect(page).toHaveURL(/\/cards\/new$/);
  });

  test("deck create requires name and at least one card", async ({ page }) => {
    await signInAs(page, "/decks/new");

    await page.getByRole("button", { name: "덱 저장" }).click();

    await expect(page.getByText("덱 이름을 입력해줘.")).toBeVisible();
    await expect(page.getByText("카드를 최소 1개 선택해줘.")).toBeVisible();
    await expect(page).toHaveURL(/\/decks\/new$/);
  });

  test("deck edit shows existing values before save", async ({ page }) => {
    await signInAs(page, "/decks/classic-miku/edit");

    await expect(page.locator("input").first()).toHaveValue(/Classic Miku/);
    await expect(page.locator("textarea").first()).toHaveValue(/대표곡/);
    await expect(page).toHaveURL(/\/decks\/classic-miku\/edit$/);
  });
});
