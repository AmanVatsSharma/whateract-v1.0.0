# Module: frontend-main-automations-page

**Short:** Workflow builder and automation execution dashboard.

**Purpose:** Provide automation CRUD with condition + multi-step workflow authoring and runtime execution visibility through logs.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `src/features/automations/services/automations.service.ts`, `src/features/automations/hooks/use-automations.ts`, `src/features/automations/hooks/use-automation-execution-logs.ts`, `/api/automations`, `/api/automations/logs`.

**APIs consumed:**
- `GET /api/automations`
- `POST /api/automations`
- `PATCH /api/automations`
- `DELETE /api/automations`
- `GET /api/automations/logs`

**Change-log:**
- 2026-02-16: Added conditional + multi-step automation form, edit mode, and execution logs table with automation-level filtering.
