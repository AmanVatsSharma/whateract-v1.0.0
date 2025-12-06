# Trading Module Guide

This note explains how the new trading cockpit keeps client-side interactions buttery smooth while always respecting the broker’s acknowledgement timeline.

## User Flow (ASCII)

```
Order Form Submit
        │
        ▼
Create optimistic order card (status=CLIENT_PENDING)
        │
        ▼
UI pins card + disables form button
        │
        ▼
call placeOrderRequest() ── waits for API/Prisma/GraphQL layer
        │
        ├── success → update card to CONFIRMED + sync positions
        │
        └── rejection/timeout → mark card REJECTED + surface reason
```

## Guardrails Implemented

- **Trading windows** live in `src/lib/trading/time-windows.ts`:
  - NSE_EQ & NSE_FO: 09:15 – 15:30 IST.
  - MCX_FO: 09:00 – 23:55 IST.
  - Validation happens before every API call so MCX never blocks valid night trades.
- **Optimistic UI** is centralized inside `src/hooks/use-orders.ts`; the hook:
  - Inserts a pending item immediately after submit.
  - Records latency samples so we can monitor Prisma/PG slowness.
  - Updates/injects positions once the backend confirms.
- **Pending persistence**: no card disappears until the Promise resolves, avoiding the previous 2-second flicker.
- **Console breadcrumbs everywhere** make debugging easy (`[TradingPage] …`, `[useOrders] …`, `[OrderService] …`).

## Files & Responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app/(main)/trading/page.tsx` | UI for watchlist, order ticket, orders & positions. |
| `src/hooks/use-orders.ts` | All optimistic state handling + latency metrics. |
| `src/lib/trading/time-windows.ts` | Exchange window constants + validation helpers. |
| `src/lib/trading/order-service.ts` | API/Prisma bridge with timeout + mock fallback. |
| `src/lib/trading/watchlist.ts` | Seed instruments covering NSE_EQ, NSE_FO, MCX_FO. |

## Performance Notes

1. **No fast-fail** – the UI stays disabled until the HTTP call completes, matching the “don’t disappear for 10 seconds” request.
2. **Timeouts** – the Axios wrapper aborts at 15s so Prisma regressions can be detected instead of hanging forever.
3. **Mock pathway** – when `NEXT_PUBLIC_USE_MOCKS=true`, the UI still waits for a simulated response (600–2,000 ms) so QA sees real behaviour.
4. **Metrics** – we keep the last 25 latency samples; surface average + latest numbers near the header for instant visibility.

## How to Extend

- Pipe real watchlist data into `defaultWatchlist` or swap it with an API call using the same type.
- Connect `/api/orders` & `/api/positions/close` to your Prisma resolvers; the hook already expects that contract.
- If you need streaming updates, add WebSocket handlers that call `updateOrder()` with the new status – the hook is ready for it.
