import { test as base, expect } from '@playwright/test';
import { WarrantyPage } from '../pages/WarrantyPage';
import { NavbarComponent } from '../pages/components/Navbar';

type CustomFixtures = {
  warrantyPage: WarrantyPage;
  navbar: NavbarComponent;
};

export const test = base.extend<CustomFixtures>({
  warrantyPage: async ({ page }, use) => {
    const warrantyPage = new WarrantyPage(page);
    await use(warrantyPage);
  },
  navbar: async ({ page }, use) => {
    const navbar = new NavbarComponent(page);
    await use(navbar);
  },
});

export { expect };
