# postman

Importable Postman collection and environment for manual exploration of the Battery ESP API.

---

## Files

- `battery-esp-api.postman_collection.json` — 4 request folders: auth, public warranty checks, protected mutations, async migration sync job
- `battery-esp-local.postman_environment.json` — local environment (`baseUrl`, `testUser`, `testPassword`, `token`, `warrantyCode`)

The auth request extracts the JWT from the response and stores it in `{{token}}` automatically, so subsequent protected requests work out of the box.

---

## Running with Newman

```bash
pnpm test:api:newman
```

Or directly:
```bash
npx newman run postman/battery-esp-api.postman_collection.json \
  -e postman/battery-esp-local.postman_environment.json \
  --reporters cli,junit
```
