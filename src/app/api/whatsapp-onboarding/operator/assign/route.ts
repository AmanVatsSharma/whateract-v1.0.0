/**
 * File: src/app/api/whatsapp-onboarding/operator/assign/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for assigning managed numbers to tenants.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Forwards operator assignment payload to backend.
 * - Returns tenant onboarding status after assignment.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(request, "/whatsapp-onboarding/operator/assign", {
    method: "POST",
    body,
  });
}
