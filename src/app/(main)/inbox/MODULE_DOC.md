# Module: inbox-page

**Short:** Operator inbox workspace with productivity filters and full tag lifecycle actions.

**Purpose:** Deliver production conversation handling with search/filtering, team-member assignment UX, status updates, notes, tag add/remove lifecycle, and outbound replies against backend-backed thread data.

**Files:**
- page.tsx
- MODULE_DOC.md

**Dependencies:** `src/features/inbox/services/inbox.service.ts`, `/api/conversations`, `/api/conversations/[conversationId]`, `/api/team-onboarding/members`.

**Flows:**
- Load tenant conversations and select active thread.
- Filter conversation list by search, status, assignee, and tag.
- Perform operator actions (assign, set status, add note/tag, send message).
- Remove tags directly from conversation context.
- Refresh list/thread after every mutation for consistent UI state.

**Change-log:**
- 2026-02-16: Added inbox page with full thread rendering and operator action wiring.
- 2026-02-16: Added inbox list filters, assign-by-team-member dropdown, and tag remove action in thread panel.
