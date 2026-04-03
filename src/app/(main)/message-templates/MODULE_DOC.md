# Module: message-templates-page

**Short:** Live template management workspace for CRUD and status transitions.

**Purpose:** Provide a production-ready UI for creating, editing, deleting, and approving/rejecting WhatsApp templates using backend-backed APIs only.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `/api/templates`, backend GraphQL template resolver.

**Flows:**
- Load template library from `/api/templates`.
- Create/update template via `POST`/`PATCH`.
- Update lifecycle status (`PENDING`, `APPROVED`, `REJECTED`) through status patch operation.
- Delete template by id through `DELETE`.

**Change-log:**
- 2026-02-16: Replaced fallback-heavy UI with API-first template lifecycle management screen.
