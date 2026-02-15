# Module: frontend-settings

**Short:** Settings feature service for workspace preferences and integration controls.

**Purpose:** Centralize settings read/write behavior through BFF routes for tenant workspace preferences, API key rotation, and webhook validation.

**Files:**
- services/settings.service.ts
- services/whatsapp-onboarding.service.ts
- MODULE_DOC.md

**Dependencies:** `/api/settings/api-key`, `/api/settings/webhook`, `/api/settings/workspace`, `/api/whatsapp-onboarding/*`.

**APIs:**
- `getWorkspaceSettings()`
- `saveWorkspaceSettings()`
- `rotateApiKey()`
- `validateWebhook()`
- `getWhatsAppOnboardingStatus()`
- `submitWhatsAppOnboardingRequest()`
- `listManagedWhatsAppNumbers()`
- `assignManagedWhatsAppNumber()`
- `setManagedWhatsAppChannelStatus()`
- `getWhatsAppOnboardingFunnel()`

**Change-log:**
- 2026-02-15: Added workspace settings persistence service methods.
- 2026-02-15: Continued integration with webhook validation and tenant API key rotation routes.
- 2026-02-15: Added managed WhatsApp onboarding service calls for tenant onboarding and operator assignment actions.
