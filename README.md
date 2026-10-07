# battery-esp-e2e

Playwright E2E suite for the Battery ESP platform — a multi-tenant storefront and warranty verification service built with Next.js and NestJS.

---

## Stack

- **Playwright** + **TypeScript** — test runner and API client
- **pnpm** — package manager
- **GitHub Actions** — CI on push/PR to `main`

---

## Structure

```
tests/
  ui/           # warranty inquiry flow, i18n + nav smoke
  api/          # HTTP contract tests against the NestJS backend
  bva/          # boundary value analysis on serial input masking
  mock/         # network fault injection via page.route()
  auth.setup.ts # session setup project (writes .auth/user.json)
pages/          # page object models
fixtures/       # test.extend() typed fixtures
postman/        # exportable collection for manual/exploratory testing
docs/           # bug reports from exploratory sessions
```

---

## Running locally

**Prerequisites:** Node 20+, pnpm 11, local dev server on `:3000` and backend on `:2000`

```bash
pnpm install
pnpm exec playwright install chromium firefox

# full suite
pnpm test

# by category
pnpm test:ui
pnpm test:api
pnpm test:bva
pnpm test:mock

# smoke only
pnpm test:smoke

# headed / debug
pnpm test:headed

# open HTML report
pnpm test:report
```

Target a different environment:
```bash
BASE_URL=https://epweb.parsany.com pnpm test:smoke
API_URL=http://localhost:2000 pnpm test:api
```

---

## Design notes

**POM with `test.extend`** — page objects are injected as typed fixtures instead of being instantiated in `beforeEach`. Keeps teardown clean and avoids eager initialization for tests that don't need a given page.

**Locators** — role-based and form-scoped (`form .text-red-500`, `form input[type="text"]`) rather than arbitrary CSS classes. Next.js route-announcer adds a `role="alert"` element to the DOM on client transitions; scoping selectors inside `<form>` avoids false matches.

**`storageState` setup project** — auth runs once as a dependency project and saves cookies + localStorage to `.auth/user.json`. No redundant UI login before every spec.

**Zero `waitForTimeout`** — all assertions use Playwright's auto-waiting web-first assertions. Arbitrary sleeps are banned.

**Network mocking** — HTTP 500 and connection failures are injected deterministically via `page.route()`. Doesn't need a broken backend to test client error handling.

**What's not automated** — real payment gateway flows (external rate limits, sandbox state) and pixel-level visual diffs (marketing banners rotate, too many false positives in CI).

---

## Postman

The `postman/` directory has an importable collection covering auth, public warranty checks, protected mutations, and an async migration sync job. Useful for quick manual exploration or reproducing specific API states before writing an automated test.

Run it headlessly with Newman:
```bash
pnpm test:api:newman
```

---

## CI

`.github/workflows/e2e.yml` runs on push/PR to `main`. Uploads the Playwright HTML report and failure traces as artifacts (retained 30 days).
