import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WarrantyPage extends BasePage {
  readonly serialInput: Locator;
  readonly submitButton: Locator;
  readonly errorBanner: Locator;
  readonly resultContainer: Locator;
  readonly resultCode: Locator;
  readonly deviceModel: Locator;
  readonly endDate: Locator;
  readonly startDate: Locator;

  constructor(page: Page) {
    super(page);
    this.serialInput = page.locator('form input[type="text"]');
    this.submitButton = page.locator('form button[type="submit"]');
    this.errorBanner = page.locator('form .text-red-500');
    this.resultContainer = page.locator('div[class*="animate-[fadeIn_0.5s_ease-out]"]');
    this.resultCode = this.resultContainer.locator('div.border span.font-mono').first();
    this.deviceModel = this.resultContainer.locator('div:has(> span:first-child) > span:last-child').first();
    this.endDate = this.resultContainer.locator('span.text-\\[\\#57BA7A\\]');
    this.startDate = this.resultContainer.locator('span.font-mono').last();
  }

  async goto(locale = 'fa') {
    await this.navigate(`/${locale}/services`);
  }

  async search(code: string) {
    await this.serialInput.fill(code);
    await this.submitButton.click();
  }

  async expectError(text?: string | RegExp) {
    await expect(this.errorBanner).toBeVisible();
    if (text) {
      await expect(this.errorBanner).toContainText(text);
    }
  }

  async expectResultVisible() {
    await expect(this.resultContainer).toBeVisible();
  }

  async expectResultDetails(expected: { code?: string; model?: string }) {
    await this.expectResultVisible();
    if (expected.code) {
      await expect(this.resultCode).toContainText(expected.code);
    }
    if (expected.model) {
      await expect(this.resultContainer).toContainText(expected.model);
    }
  }
}
