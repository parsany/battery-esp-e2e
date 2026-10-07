import { test, expect } from '../../fixtures';

test.describe('warranty serial input formatting & validation @bva', () => {
  test.beforeEach(async ({ warrantyPage }) => {
    await warrantyPage.goto('fa');
  });

  const lengthCases = [
    {
      description: 'empty string',
      input: '',
      expected: '',
      isValid: false,
    },
    {
      description: 'single character',
      input: 'A',
      expected: 'A',
      isValid: false,
    },
    {
      description: '8 characters (under minimum length)',
      input: 'ABC123XY',
      expected: 'ABC-123-XY',
      isValid: false,
    },
    {
      description: '9 characters (standard format)',
      input: 'ABC123XYZ',
      expected: 'ABC-123-XYZ',
      isValid: true,
    },
    {
      description: '12 characters clamped to 9',
      input: 'ABC123XYZ999',
      expected: 'ABC-123-XYZ',
      isValid: true,
    },
  ];

  test('formats input and handles length limits', async ({ warrantyPage }) => {
    for (const c of lengthCases) {
      await test.step(`check ${c.description}`, async () => {
        await warrantyPage.serialInput.fill(c.input);
        await expect(warrantyPage.serialInput).toHaveValue(c.expected);

        if (!c.isValid) {
          if (!c.input) {
            await expect(warrantyPage.submitButton).toBeDisabled();
          } else {
            await warrantyPage.submitButton.click();
            await warrantyPage.expectError();
          }
        }
      });
    }
  });

  const sanitizeCases = [
    {
      description: 'lowercase input converted to uppercase',
      input: 'abc123xyz',
      expected: 'ABC-123-XYZ',
    },
    {
      description: 'strips special characters',
      input: 'a!b@c#1$2%3',
      expected: 'ABC-123',
    },
    {
      description: 'handles pre-formatted hyphens',
      input: 'abc-123-xyz',
      expected: 'ABC-123-XYZ',
    },
  ];

  test('normalizes casing and filters special characters', async ({ warrantyPage }) => {
    for (const c of sanitizeCases) {
      await test.step(`check ${c.description}`, async () => {
        await warrantyPage.serialInput.fill(c.input);
        await expect(warrantyPage.serialInput).toHaveValue(c.expected);
      });
    }
  });
});
