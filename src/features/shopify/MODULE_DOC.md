# Module: frontend-shopify

**Short:** Frontend Shopify service integration layer.

**Purpose:** Support Shopify connect/sync/status actions from UI pages via BFF routes.

**Files:**
- services/shopify.service.ts
- ../../app/(main)/shopify/page.tsx

**Dependencies:** `apiClient`, BFF routes under `src/app/api/shopify`.

**APIs:**
- `POST /api/shopify/connect`
- `POST /api/shopify/sync/orders`
- `POST /api/shopify/sync/customers`
- `POST /api/shopify/sync/products`
- `GET /api/shopify/status`

**Change-log:**
- 2026-02-15: Added dedicated Shopify management page with status + sync actions.
- 2026-02-15: Connected service calls to backend-backed BFF endpoints.
- 2026-02-15: Added product sync action and product sync status visibility on Shopify page.
- 2026-02-15: Standardized connect/status/sync BFF responses to `{ data }` / `{ error }` envelopes.
- 2026-02-15: Updated `shopify.service.ts` to unwrap envelope payloads and throw normalized route errors.
- 2026-02-15: Added shopify connect/status/sync BFF regression tests to prevent contract drift.
- 2026-02-15: Surfaced commerce journey count in Shopify status panel for marketing automation readiness.
