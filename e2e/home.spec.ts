import { test, expect } from "@playwright/test";

test("home shows cards and filters by tag", async ({ page }) => {
  await page.goto("/");

  const initialCount = await page.getByTestId("card").count();
  expect(initialCount).toBeGreaterThan(0);

  await page.getByTestId("tag-classic").click();
  const filteredCount = await page.getByTestId("card").count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThanOrEqual(initialCount);

  await page.getByTestId("tag-all").click();
  await expect(page.getByTestId("card")).toHaveCount(initialCount);
});
