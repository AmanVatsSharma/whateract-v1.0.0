# Backend Performance Playbook

The slowdown from ~1 s (GraphQL → PG) to ~10 s (Next API → Prisma) typically comes from connection contention plus extra serial logic inside the API route. This guide consolidates the mitigation plan.

## Request Flow

```
Client Order
    │
    ▼
Next.js API Route (/api/orders)
    │  (validation, trading window gate, logging)
    ▼
Prisma Client
    │  (connection pooling, prepared statements)
    ▼
PostgreSQL
```

## Immediate Fixes

1. **Connection pooling** – run Prisma through PgBouncer or use Prisma Accelerate so t3.medium’s limited CPU doesn’t thrash on TLS handshakes.
2. **Batching** – collapse multi-query sequences (e.g., fetch position → insert order → insert logs) into a single transaction using `prisma.$transaction`.
3. **Indexes** – confirm indexes exist for `orders.user_id`, `orders.symbol`, `positions.status` to avoid sequential scans.
4. **DataLoader-style caching** – when multiple UI widgets hit the same table, dedupe inside the API route before calling Prisma.
5. **Timeout parity** – keep the new 15 s HTTP timeout but set a lower DB statement timeout (e.g., 8 s) so the API can return a controlled error instead of hanging.

## Observability Checklist

- Add `performance.now()` metrics around every Prisma call and ship them to your logger (console logs already exist in the new order service).
- Use AWS CloudWatch alarms on latency ≥4 s and p95 CPU ≥70% for 5 minutes.
- Enable Prisma query logging in staging to identify slow SQL statements.

## t3.medium Capacity Estimate

| Resource | Notes |
| --- | --- |
| vCPU | 2 vCPU burstable (baseline 20%) |
| Memory | 4 GB RAM |
| Realistic concurrent users | ~150–200 websocket-free users (≈15–20 order placements/sec) assuming PgBouncer + cached refs. |

> For bursty trading sessions or heavy analytics, consider t3.large or c7g.large to double throughput.

## Deployment Tips

- Run the Next app behind AWS ALB with HTTP keep-alive enabled.
- Turn on compression (Next already ships gzip) and prefer Edge CDN for static assets so the instance focuses on API work.
- Keep Prisma client warm by importing it once per Lambda/Edge worker (already satisfied inside `/prisma/client.ts` if you add one later).

## Action Items Recap

1. Enable pooling (PgBouncer/Prisma Accelerate) → removes connection thrash.
2. Audit slow queries with `EXPLAIN ANALYZE` + add missing indexes.
3. Move any synchronous `await` loops to `Promise.all` on the API route.
4. Keep Next API routes lean (validation + Prisma) and let React handle optimistic UI (done in `useOrders`).
