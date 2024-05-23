import { test, expect } from "@playwright/test";

test("Requires authentication", async ({ page }) => {
  await page.goto("/");
  await expect(page.url()).toContain("/auth");
});
