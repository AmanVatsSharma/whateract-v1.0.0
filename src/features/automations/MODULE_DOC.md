# Module: frontend-automations

**Short:** Automation feature hooks/services for workflow lifecycle and execution logs.

**Purpose:** Provide reusable API abstractions for listing, creating, updating, enabling, deleting automation rules, plus fetching execution logs.

**Files:**
- hooks/use-automations.ts
- hooks/use-automation-execution-logs.ts
- services/automations.service.ts
- MODULE_DOC.md

**Dependencies:** React Query, `/api/automations` BFF route.

**APIs:**
- `fetchAutomations()`
- `fetchAutomationExecutionLogs()`
- `createAutomation()`
- `updateAutomation()`
- `setAutomationEnabled()`
- `deleteAutomation()`

**Change-log:**
- 2026-02-16: Added execution logs hook/service integration and expanded automation list contract with `definitionJson`, `stepsCount`, and `conditionsCount`.
- 2026-02-15: Added new frontend automations feature module with typed CRUD APIs.
- 2026-02-15: Added React Query hook for cache-backed automation listing.
