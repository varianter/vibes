import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  const consultantName = page.getByText("Test Consultant");

  await expect(consultantName).toBeVisible();
});
