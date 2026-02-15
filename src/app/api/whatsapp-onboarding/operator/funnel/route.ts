/**
 * File: src/app/api/whatsapp-onboarding/operator/funnel/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for onboarding funnel analytics snapshot.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Used by operations dashboard widgets in analytics/settings.
 * - Returns status bucket counts from backend onboarding service.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonDataResponse(request, "/whatsapp-onboarding/operator/funnel");
}
