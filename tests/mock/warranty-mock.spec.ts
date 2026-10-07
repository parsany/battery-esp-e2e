import { test, expect } from '../../fixtures';

test.describe('network fault injection @mock', () => {
  test('aborted warranty request shows error, result stays hidden', async ({ page, warrantyPage }) => {
    await page.route('**/warranties/check/*', (route) => route.abort('failed'));

    await warrantyPage.goto('fa');
    await warrantyPage.search('ERR-500-SRV');

    await warrantyPage.expectError();
    await expect(warrantyPage.resultContainer).not.toBeVisible();
  });
});
