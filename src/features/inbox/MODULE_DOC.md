# Module: frontend-inbox

**Short:** Inbox feature services and hooks for conversation operations.

**Purpose:** Provide typed API calls for conversation list, message send, assignment, status, tags, notes, and AI helpers.

**Files:**
- hooks/use-conversations.ts
- services/inbox.service.ts
- MODULE_DOC.md

**Dependencies:** React Query, `/api/conversations`, `/api/conversations/[conversationId]`, `/api/ai/*`.

**APIs:**
- `fetchConversations()`
- `fetchConversationThread()`
- `sendConversationMessage()`
- `assignConversation()`
- `setConversationStatus()`
- `addConversationNote()`
- `tagConversation()`
- `untagConversation()`
- `fetchAssignableMembers()`
- `getConversationLabel()`
- `fetchAiReply()`
- `summarizeConversation()`

**Change-log:**
- 2026-02-16: Added inbox filtering params on `fetchConversations` and added tag removal + assignable-member service methods for inbox productivity UX.
- 2026-02-15: Added conversation mutation helpers for assignment/status/note/tag/send actions.
- 2026-02-15: Kept AI assist requests in same feature service to keep inbox page orchestration cohesive.
- 2026-02-16: Added thread fetch support for inbox UI and aligned service contracts with thread endpoint.
