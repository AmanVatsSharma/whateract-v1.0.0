/**
 * File: src/features/campaigns/services/campaigns.service.ts
 * Module: frontend-campaigns
 * Purpose: Campaign data access layer for UI components/pages.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Uses BFF route `/api/campaigns` as stable contract.
 * - Maps backend payload to campaign list shape.
 */

import { apiClient } from "@/lib/api-client";
import { CampaignListItem, CampaignsResponse } from "@/types/api-contracts";

export async function fetchCampaigns(): Promise<CampaignListItem[]> {
  const response = await apiClient.get<CampaignsResponse>("/campaigns");
  return response.data?.data || [];
}

