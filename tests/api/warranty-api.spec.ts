import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_URL ?? 'http://localhost:2000';

test.describe('warranty API @api', () => {
  test('GET /warranties/check/:code returns 200 or 404 with JSON', async ({ request }) => {
    const res = await request.get(`${API_BASE}/warranties/check/TEST-123-CODE`);

    expect([200, 404]).toContain(res.status());
    expect(res.headers()['content-type']).toContain('application/json');

    const body = await res.json();
    expect(body).toBeDefined();
  });

  test('POST with invalid payload returns 400', async ({ request }) => {
    const res = await request.post(`${API_BASE}/warranties`, {
      data: { invalidField: true },
      headers: { 'Content-Type': 'application/json' },
    });

    expect([400, 401]).toContain(res.status());
  });

  test('POST without auth token returns 401', async ({ request }) => {
    const res = await request.post(`${API_BASE}/warranties`, {
      data: {
        code: 'SEC-999-HACK',
        productName: 'Unauthorized Product Entry',
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toMatch(/unauthorized/i);
  });
});
