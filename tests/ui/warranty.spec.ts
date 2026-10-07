import { test, expect } from '../../fixtures';

test.describe('warranty inquiry @smoke', () => {
  test.beforeEach(async ({ warrantyPage }) => {
    await warrantyPage.goto('fa');
  });

  test('valid serial displays warranty status and product info', async ({ page, warrantyPage }) => {
    await page.route('**/warranties/check/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'BAT-123-ESP',
          productName: 'ESP Ultra 60Ah Automotive Battery',
          assignedAt: '2026-01-01T00:00:00.000Z',
          expiryDate: '2028-01-01T00:00:00.000Z',
          status: 'active',
          remainingPercent: 85,
        }),
      });
    });

    await warrantyPage.search('BAT-123-ESP');
    await warrantyPage.expectResultVisible();
    await warrantyPage.expectResultDetails({
      code: 'BAT-123-ESP',
      model: 'ESP Ultra 60Ah Automotive Battery',
    });
  });

  test('malformed serial triggers format validation', async ({ warrantyPage }) => {
    await warrantyPage.serialInput.fill('123');
    const submitBtn = warrantyPage.submitButton;
    if (await submitBtn.isEnabled()) {
      await submitBtn.click();
      await warrantyPage.expectError();
    } else {
      await expect(submitBtn).toBeDisabled();
    }
  });

  test('non-existent serial shows not-found alert', async ({ page, warrantyPage }) => {
    await page.route('**/warranties/check/*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ statusCode: 404, message: 'Warranty not found' }),
      });
    });

    await warrantyPage.search('NON-999-NOT');
    await warrantyPage.expectError();
  });
});
