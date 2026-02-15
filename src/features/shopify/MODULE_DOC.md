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
- `GET /api/shopify/status`

**Change-log:**
- 2026-02-15: Added dedicated Shopify management page with status + sync actions.
- 2026-02-15: Connected service calls to backend-backed BFF endpoints.
