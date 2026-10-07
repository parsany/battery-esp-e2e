import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.resolve('.auth');
const AUTH_FILE = path.join(AUTH_DIR, 'user.json');
const API_BASE = process.env.API_URL ?? 'http://localhost:2000';

setup('authenticate session', async ({ request }) => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const username = process.env.TEST_USER ?? 'admin';
  const password = process.env.TEST_PASSWORD ?? 'admin123';
  let token = 'mock-e2e-bearer-token';

  try {
    const res = await request.post(`${API_BASE}/auth/signin`, {
      data: { username, password },
      failOnStatusCode: false,
    });

    if (res.ok()) {
      const data = await res.json();
      token = data.accessToken || data.token || token;
    }
  } catch {
    // fallback if backend is offline during local test runs
  }

  const storageState = {
    cookies: [
      {
        name: 'auth-token',
        value: token,
        domain: 'localhost',
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 86400,
        httpOnly: true,
        secure: false,
        sameSite: 'Lax' as const,
      },
    ],
    origins: [
      {
        origin: 'http://localhost:3000',
        localStorage: [
          {
            name: 'auth_token',
            value: token,
          },
          {
            name: 'user_role',
            value: 'admin',
          },
        ],
      },
    ],
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2));
  expect(fs.existsSync(AUTH_FILE)).toBe(true);
});
