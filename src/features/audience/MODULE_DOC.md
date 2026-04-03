# Module: frontend-audience

**Short:** Audience data services for contacts and segmentation.

**Purpose:** Provide reusable audience APIs for contact listing and segment summary retrieval through BFF routes.

**Files:**
- services/audience.service.ts
- MODULE_DOC.md

**Dependencies:** `/api/audience`, `/api/audience/segments`.

**APIs:**
- `fetchAudienceContacts()`
- `fetchAudienceSegments()`

**Change-log:**
- 2026-02-16: Added audience feature service module with segment-aware contact retrieval helpers.
