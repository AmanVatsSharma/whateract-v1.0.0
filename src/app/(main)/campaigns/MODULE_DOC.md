# Module: frontend-main-campaigns-page

**Short:** Campaign composition and targeting UI.

**Purpose:** Provide operator-facing campaign lifecycle controls: compose message/template payloads, target audience contacts, edit/duplicate campaign definitions, and trigger status transitions.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `src/features/campaigns/services/campaigns.service.ts`, `src/features/campaigns/hooks/use-campaigns.ts`, `/api/campaigns`, `/api/templates`, `/api/audience`.

**APIs consumed:**
- `GET /api/campaigns`
- `POST /api/campaigns` (create/duplicate)
- `PUT /api/campaigns` (update)
- `PATCH /api/campaigns` (status transitions)
- `DELETE /api/campaigns`

**Change-log:**
- 2026-02-16: Introduced composition fields (message/template), contact targeting selector, and edit/duplicate actions in campaign list.
