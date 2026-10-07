import { type Page, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForUrl(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }
}
