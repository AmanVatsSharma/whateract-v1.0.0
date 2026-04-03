# Module: shopify-page

**Short:** Shopify connection and sync operations UI.

**Purpose:** Support OAuth-first Shopify connection flow and tenant sync controls for orders, customers, and products.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `src/features/shopify/services/shopify.service.ts`, `/api/shopify/*`.

**Change-log:**
- 2026-02-16: Shifted connect UX from manual token entry to OAuth-first flow with callback result handling.
