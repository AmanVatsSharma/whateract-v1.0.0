/**
 * File: src/features/shopify/services/shopify.service.ts
 * Module: frontend-shopify
 * Purpose: Frontend service layer for Shopify integration APIs.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Calls frontend BFF routes (`/api/*`) for Shopify flows.
 * - Intended for settings/integrations UX wiring.
 */

import { apiClient } from "@/lib/api-client";

type Envelope<T> = {
  data?: T;
  error?: string;
};

export async function connectShopifyStore(payload: {
  shopDomain: string;
  accessToken: string;
  scopes?: string[];
}) {
  const response = await apiClient.post<Envelope<Record<string, unknown>>>(
    "/shopify/connect",
    payload
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function syncShopifyOrders(limit = 25) {
  const response = await apiClient.post<Envelope<Record<string, unknown>>>(
    "/shopify/sync/orders",
    { limit }
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function syncShopifyCustomers(limit = 25) {
  const response = await apiClient.post<Envelope<Record<string, unknown>>>(
    "/shopify/sync/customers",
    { limit }
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function syncShopifyProducts(limit = 25) {
  const response = await apiClient.post<Envelope<Record<string, unknown>>>(
    "/shopify/sync/products",
    { limit }
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function getShopifyStatus() {
  const response = await apiClient.get<Envelope<Record<string, unknown>>>(
    "/shopify/status"
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

