# Module: frontend-bff

**Short:** Shared helpers and GraphQL documents for Next.js BFF route handlers.

**Purpose:** Centralize backend proxy behavior, auth cookie handling, and GraphQL query strings used by `src/app/api/*`.

**Files:**
- backend-proxy.ts
- graphql-queries.ts
- auth-cookies.ts
- feature-bff-guard.ts — inbox/automations feature gating for BFF routes

**Dependencies:** Next.js route handlers, backend GraphQL API, browser cookies.

**Change-log:**
- 2026-04-04: Added `feature-bff-guard.ts` to return 503 when inbox/automations public flags are off or when server `FEATURE_*` mirrors disagree with `NEXT_PUBLIC_*`.
- 2026-02-15: Renamed service namespace from `services/backend` to `services/bff`.
- 2026-02-15: Centralized GraphQL documents used by campaign/analytics/auth/audience/template/automation routes.
- 2026-02-15: Added shared auth cookie helpers and tenant header propagation fallback.
- 2026-02-15: Enforced BFF-only frontend API boundary via client guardrails and boundary check script.
- 2026-02-15: Added backend proxy timeout handling, generated request correlation IDs, and standardized relay failures.
- 2026-02-15: Added `relayJsonDataResponse` to normalize JSON API contracts (`{ data }` / `{ error }`) for auth/shopify route handlers.
- 2026-02-15: Added BFF regression tests for backend-proxy envelope behavior and high-risk auth/shopify route contracts.
- 2026-02-15: Added campaign and automation mutation documents for create/update/delete lifecycle actions.
- 2026-02-15: Added settings workspace route support to persist tenant-level preferences via integrations APIs.
- 2026-02-15: Tightened architecture guardrail by failing boundary checks when legacy directories are reintroduced.
- 2026-02-15: Added onboarding funnel GraphQL document for activation-stage analytics and operations dashboards.
