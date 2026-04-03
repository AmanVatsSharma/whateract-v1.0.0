# Module: audience-page

**Short:** Segment-aware tenant audience contact directory.

**Purpose:** Provide segment-aware contact listings sourced from backend audience APIs with no fallback content.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `src/features/audience/services/audience.service.ts`, `/api/audience`, `/api/audience/segments`.

**Change-log:**
- 2026-02-16: Replaced fallback contact samples with API-driven audience directory and explicit empty states.
- 2026-02-16: Added backend-segment-aware filtering UI and segment metric cards.
