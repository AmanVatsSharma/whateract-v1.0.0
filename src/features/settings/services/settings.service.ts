/**
 * File: src/features/settings/services/settings.service.ts
 * Module: frontend-settings
 * Purpose: Settings API service for webhook validation and API key rotation.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Uses frontend BFF endpoints.
 * - Encapsulates request/response parsing for settings page.
 */

import { apiClient } from "@/lib/api-client";

export async function rotateApiKey() {
  const response = await apiClient.post<{ key: string }>("/settings/api-key");
  return response.data?.key || "";
}

export async function validateWebhook(url: string, secret: string) {
  const response = await apiClient.post<{ ok: boolean; message?: string }>(
    "/settings/webhook",
    {
      url,
      secret,
    }
  );
  return response.data;
}

