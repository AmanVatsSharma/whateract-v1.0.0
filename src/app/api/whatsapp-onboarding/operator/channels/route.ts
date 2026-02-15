/**
 * File: src/app/api/whatsapp-onboarding/operator/channels/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for operator channel status listing.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - GET supports optional `status` filtering.
 * - Used by settings onboarding operator panel.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

function buildBackendPath(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  if (!status) {
    return "/whatsapp-onboarding/operator/channels";
  }
  return `/whatsapp-onboarding/operator/channels?status=${encodeURIComponent(status)}`;
}

export async function GET(request: Request) {
  return relayJsonDataResponse(request, buildBackendPath(request));
}
