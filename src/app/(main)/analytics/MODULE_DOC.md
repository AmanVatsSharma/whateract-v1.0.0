# Module: analytics-page

**Short:** API-backed analytics and onboarding funnel insights.

**Purpose:** Show campaign throughput and onboarding funnel metrics from backend analytics routes without fallback datasets.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `/api/analytics/overview`, `/api/analytics/campaign-kpis`, `/api/analytics/onboarding-funnel`.

**Change-log:**
- 2026-02-16: Migrated analytics screen to live API-only mode with explicit empty/error handling.
