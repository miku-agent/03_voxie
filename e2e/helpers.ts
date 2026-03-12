import { expect, type Page } from "@playwright/test";

export async function signInAs(page: Page, redirectedFrom = "/") {
  await page.goto(`/auth?redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  await page.getByPlaceholder("you@voxie.dev").fill("e2e-user@voxie.dev");
  await page.getByPlaceholder("8자 이상").fill("password123");
  await page.locator("form").getByRole("button", { name: /^로그인$/ }).click();
  await expect(page).toHaveURL(new RegExp(`${redirectedFrom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
}
