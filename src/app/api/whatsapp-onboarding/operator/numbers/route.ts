/**
 * File: src/app/api/whatsapp-onboarding/operator/numbers/route.ts
 * Module: frontend-bff
 * Purpose: BFF routes for managed WhatsApp number inventory operations.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - GET supports optional `status` filter.
 * - POST upserts a managed number record.
 */
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

function buildBackendPath(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  if (!status) {
    return "/whatsapp-onboarding/operator/numbers";
  }
  return `/whatsapp-onboarding/operator/numbers?status=${encodeURIComponent(status)}`;
}

export async function GET(request: Request) {
  return relayJsonDataResponse(request, buildBackendPath(request));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(request, "/whatsapp-onboarding/operator/numbers", {
    method: "POST",
    body,
  });
}
