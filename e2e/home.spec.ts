import { test, expect } from "@playwright/test";

test("home shows cards and filters by tag", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("card")).toHaveCount(5);

  await page.getByTestId("tag-classic").click();
  await expect(page.getByTestId("card")).toHaveCount(4);

  await page.getByTestId("tag-all").click();
  await expect(page.getByTestId("card")).toHaveCount(5);
});
