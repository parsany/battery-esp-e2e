# Bug Reports

Defects found during exploratory sessions against the Battery ESP storefront and API.

---

### BUG-001 — Missing user-facing error on 500 response

**Severity:** High  
**Where:** `/fa/services` — warranty search form  
**Steps:**  
1. Block or kill the backend (`GET /warranties/check/*`)
2. Submit a validly-formatted serial code

**Expected:** Alert telling the user the service is temporarily unavailable  
**Actual:** UI displays a generic "Not found" message regardless of whether the error was a network failure or a true 404  
**Regression:** `tests/mock/warranty-mock.spec.ts`

---

### BUG-002 — Paste into serial field can briefly show unmasked input

**Severity:** Medium  
**Where:** Serial code input, all browsers  
**Steps:**  
1. Paste a 20-character string into the field

**Expected:** Input clamps to 9 alphanumeric chars and formats immediately  
**Actual:** Sanitizer truncates to 9 but there's a visible flash of the unformatted raw value before the React re-render catches it  
**Regression:** `tests/bva/warranty-bva.spec.ts` — TC-BVA-01

---

### BUG-003 — Native `maxlength="11"` truncates clipboard content before sanitizer runs

**Severity:** Medium  
**Component:** `WarrantyInquiry` (`warranty-inquiry.tsx`)  
**Where:** Serial code input, all browsers  
**Steps:**  
1. Copy a string like `"SN: ABC123XYZ"` or `"ABC - 123 - XYZ"` (>11 chars with delimiters)
2. Paste into the serial field

**Expected:** JS sanitizer strips non-alphanumerics from the full raw string, extracts 9 chars, formats to `ABC-123-XYZ`  
**Actual:** Browser's native `maxlength="11"` cuts the raw input at 11 characters *before* the `onChange` handler fires — the trailing characters are gone before the formatter ever sees them, resulting in an incomplete serial and a false "Invalid Code" error

**Root cause:** `maxLength={11}` constrains raw keystrokes, not post-sanitization character count  
**Fix:** Remove `maxLength` or set it to something like 24, let the JS formatter handle clamping via `.slice(0, 9)`  
**Regression:** `tests/bva/warranty-bva.spec.ts` — TC-BVA-02
