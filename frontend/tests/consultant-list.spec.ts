import { test, expect } from "@playwright/test";

test("Has organisation index page", async ({ page }) => {
  await page.goto("/");
  const orgLink = page.getByText("My Organisation");
  await orgLink.click();

  const consultantName = page.getByText("Test Consultant");

  await expect(consultantName).toBeVisible();
});
