import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  const consultantName = await page.getByText('Test Consultant');

  // Expect a title "to contain" a substring.
  await expect(consultantName).toBeVisible()

});
