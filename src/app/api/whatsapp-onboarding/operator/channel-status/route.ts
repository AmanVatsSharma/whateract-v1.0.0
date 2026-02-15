/**
 * File: src/app/api/whatsapp-onboarding/operator/channel-status/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for operator-driven channel status transitions.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Used to activate/suspend/update channel review details.
 * - Proxies payload to backend onboarding operator endpoint.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(
    request,
    "/whatsapp-onboarding/operator/channel-status",
    {
      method: "POST",
      body,
    },
  );
}
