# Module: frontend-automations

**Short:** Automation feature hooks/services for backend automation lifecycle.

**Purpose:** Provide reusable API abstractions for listing, creating, updating, enabling, and deleting automation rules.

**Files:**
- hooks/use-automations.ts
- services/automations.service.ts
- MODULE_DOC.md

**Dependencies:** React Query, `/api/automations` BFF route.

**APIs:**
- `fetchAutomations()`
- `createAutomation()`
- `updateAutomation()`
- `setAutomationEnabled()`
- `deleteAutomation()`

**Change-log:**
- 2026-02-15: Added new frontend automations feature module with typed CRUD APIs.
- 2026-02-15: Added React Query hook for cache-backed automation listing.
