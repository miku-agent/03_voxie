import { test, expect } from "@playwright/test";

test("card detail page renders", async ({ page }) => {
  await page.goto("/cards/melt");
  await expect(page.getByRole("heading", { name: "Melt" })).toBeVisible();
});
