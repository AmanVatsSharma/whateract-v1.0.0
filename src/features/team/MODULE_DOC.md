# Module: frontend-team

**Short:** Team onboarding frontend service and management page.

**Purpose:** Enable workspace owners to create teams, invite members, accept invites, and view member rosters.

**Files:**
- services/team.service.ts
- ../../app/(main)/team/page.tsx

**Dependencies:** `apiClient`, BFF routes under `src/app/api/team-onboarding`.

**APIs:**
- `POST /api/team-onboarding/team`
- `POST /api/team-onboarding/invites`
- `POST /api/team-onboarding/invites/accept`
- `GET /api/team-onboarding/members`

**Change-log:**
- 2026-02-15: Added dedicated Team onboarding page with create/invite/accept/member workflows.
- 2026-02-15: Wired UI to backend team-onboarding service routes.
