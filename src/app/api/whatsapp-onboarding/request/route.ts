/**
 * File: src/app/api/whatsapp-onboarding/request/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for tenant onboarding request submission.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Accepts tenant onboarding profile payload from settings UI.
 * - Returns normalized `{ data | error }` payload envelope.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(request, "/whatsapp-onboarding/request", {
    method: "POST",
    body,
  });
}
