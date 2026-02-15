# BFF Architecture (Frontend)

## Intent

This frontend follows a strict BFF (Backend for Frontend) pattern:

- UI and client logic stay in React/Next pages and feature modules.
- Server-side API orchestration stays in Next route handlers (`src/app/api/*`).
- Shared proxy behavior stays in `src/services/bff/*`.
- Nest backend remains the only source for business logic and persistence.

## Request Flow

`UI Component -> apiClient (/api) -> Next Route Handler (BFF) -> backend-proxy -> Nest API`

## Boundary Rules

1. Frontend feature/UI code must not import backend frameworks (`@nestjs`, `typeorm`, `prisma`, etc.).
2. Frontend feature/UI code must not call backend host URLs directly.
3. Feature services should call only `/api/*` endpoints through `apiClient`.
4. Route handlers are the only place where `BACKEND_API_URL` is used.

## Guardrails Added

- `npm run check:boundaries` validates boundary rules in `src/`.
- `apiClient` enforces `/api` base URL and ignores non-BFF base URLs.
- BFF proxy adds request correlation headers and timeout protection.

## Notes

- Keeping BFF in frontend is intentional and not a boundary violation.
- If a route requires business rules, move logic to backend and keep BFF thin.
