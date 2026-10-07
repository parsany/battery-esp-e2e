import { test, expect } from '../../fixtures';

test.describe('navigation and i18n @smoke', () => {
  test('language switcher toggles locale route', async ({ page, navbar }) => {
    await page.goto('/fa/services');

    await navbar.switchLocale('en');
    await expect(page).toHaveURL(/\/en\/services/);
    await navbar.expectCurrentLocale('en');

    await navbar.switchLocale('fa');
    await expect(page).toHaveURL(/\/fa\/services/);
    await navbar.expectCurrentLocale('fa');
  });

  test('smoke navigation across primary routes', async ({ page }) => {
    await page.goto('/fa/landing');
    await expect(page).toHaveURL(/\/(fa|en)\/landing/);

    await page.goto('/fa/services');
    await expect(page).toHaveURL(/\/(fa|en)\/services/);
    await expect(page.locator('form input[type="text"]')).toBeVisible();
  });
});
