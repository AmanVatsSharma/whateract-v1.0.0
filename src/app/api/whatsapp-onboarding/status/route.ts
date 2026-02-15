/**
 * File: src/app/api/whatsapp-onboarding/status/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for tenant WhatsApp onboarding status fetch.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Forwards request to backend onboarding status endpoint.
 * - Keeps tenant/auth headers server-side via backend-proxy.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonDataResponse(request, "/whatsapp-onboarding/status");
}
