# Whaterakt Frontend

Next.js frontend for Whaterakt WhatsApp marketing platform.

## Quick Start

```bash
npm install
npm run dev
```

## Architecture

- App routes: `src/app/(main)` and `src/app/api`
- Feature modules: `src/features/*`
- Shared services/types:
  - `src/services`
  - `src/types`
  - `src/components/shared`

## API/BFF

- Frontend API handlers in `src/app/api/**` proxy to backend.
- Shared backend proxy utilities live in `src/services/bff/backend-proxy.ts`.
- BFF JSON responses are standardized to:
  - success: `{ data: ... }`
  - failure: `{ error: "..." }`

## Quality Commands

```bash
npm run lint
npm run build
npm run test
npm run check:boundaries
```
