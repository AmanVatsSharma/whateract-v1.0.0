/**
 * File: src/features/shopify/services/shopify.service.ts
 * Module: frontend-shopify
 * Purpose: Frontend service layer for Shopify integration APIs.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Calls backend directly for Shopify flows.
 * - Intended for settings/integrations UX wiring.
 */

import { apiClient } from "@/lib/api-client";

export async function connectShopifyStore(payload: {
  shopDomain: string;
  accessToken: string;
  scopes?: string[];
}) {
  const response = await apiClient.post("/shopify/connect", payload);
  return response.data;
}

export async function syncShopifyOrders(limit = 25) {
  const response = await apiClient.post("/shopify/sync/orders", { limit });
  return response.data;
}

export async function syncShopifyCustomers(limit = 25) {
  const response = await apiClient.post("/shopify/sync/customers", { limit });
  return response.data;
}

export async function getShopifyStatus() {
  const response = await apiClient.get("/shopify/status");
  return response.data;
}

