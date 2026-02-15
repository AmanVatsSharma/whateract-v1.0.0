# Module: frontend-auth

**Short:** Frontend authentication flows and API service wrappers.

**Purpose:** Provide login, signup, forgot-password, and reset-password UX wired through Next.js BFF auth routes.

**Files:**
- services/auth.service.ts
- ../../app/login/page.tsx
- ../../app/signup/page.tsx
- ../../app/forgot-password/page.tsx
- ../../app/reset-password/page.tsx

**Dependencies:** `apiClient`, Next.js router/navigation, sonner toasts.

**APIs:**
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

**Change-log:**
- 2026-02-15: Added auth service and user-facing auth pages.
- 2026-02-15: Wired auth cookies (`access_token`, `tenant_id`) through BFF handlers.
