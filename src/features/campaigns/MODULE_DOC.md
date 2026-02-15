# Module: frontend-campaigns

**Short:** Campaign data hooks/services for campaign lifecycle operations.

**Purpose:** Keep campaign page logic thin by centralizing list/create/status/delete API calls in a reusable feature service.

**Files:**
- hooks/use-campaigns.ts
- services/campaigns.service.ts
- MODULE_DOC.md

**Dependencies:** `@tanstack/react-query`, `/api/campaigns` BFF route.

**APIs:**
- `fetchCampaigns()`
- `createCampaign()`
- `setCampaignStatus()`
- `deleteCampaign()`

**Change-log:**
- 2026-02-15: Added mutation service methods for create, status transition, and delete.
- 2026-02-15: Kept list retrieval in shared React Query hook for consistent cache invalidation.
