import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Kaku Blogs/);

  // Expect hero section to be visible
  await expect(page.locator('h1')).toContainText(/Start sharing your/);
});
