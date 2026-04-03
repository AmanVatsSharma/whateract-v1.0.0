/**
 * File: src/app/api/whatsapp-onboarding/operator/oba-status/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for operator OBA (green tick) status updates.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(request, "/whatsapp-onboarding/operator/oba-status", {
    method: "POST",
    body,
  });
}
