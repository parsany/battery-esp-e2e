import { type Page, type Locator, expect } from '@playwright/test';

export class NavbarComponent {
  readonly page: Page;
  readonly localeButton: Locator;
  readonly localeDropdown: Locator;
  readonly navLinks: Locator;
  readonly servicesLink: Locator;
  readonly brandLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.localeButton = page.locator('nav button:has(.lucide-chevron-down), header button:has(.lucide-chevron-down)').first();
    this.localeDropdown = page.locator('div.origin-top-right');
    this.navLinks = page.locator('nav a, header a');
    this.servicesLink = page.locator('nav a[href*="/services"], header a[href*="/services"]').first();
    this.brandLogo = page.locator('nav a[href="/"], header a[href="/"], nav a[href="/fa"], nav a[href="/en"]').first();
  }

  async switchLocale(targetLocale: 'fa' | 'en') {
    const targetLabel = targetLocale.toUpperCase();
    if (await this.localeButton.isVisible()) {
      await this.localeButton.click();
      await expect(this.localeDropdown).toBeVisible();
      await this.localeDropdown.locator(`button:has-text("${targetLabel}")`).click();
    } else {
      // Mobile drawer toggle
      const menuBtn = this.page.locator('button[aria-label="Toggle Menu"]');
      await menuBtn.click();
      await this.page.locator(`div[class*="z-[100]"] button:has-text("${targetLabel}")`).click();
    }
  }

  async expectCurrentLocale(locale: 'fa' | 'en') {
    const label = locale.toUpperCase();
    if (await this.localeButton.isVisible()) {
      await expect(this.localeButton).toContainText(label);
    } else {
      const activeMobile = this.page.locator(`button.bg-primary:has-text("${label}")`).first();
      await expect(activeMobile).toBeVisible();
    }
  }
}
