/**
 * File: src/features/campaigns/services/campaigns.service.ts
 * Module: frontend-campaigns
 * Purpose: Campaign data access layer for UI components/pages.
 * Author: Aman Sharma / Vedpragya/ Codex
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

type DataEnvelope<T> = {
  data?: T;
  error?: string;
};

export async function createCampaign(payload: {
  name: string;
  type: "BROADCAST" | "TRIGGERED" | "SEQUENCE";
  scheduledAt?: string | null;
  messageBody?: string | null;
  templateName?: string | null;
  audienceContactIds?: string[];
}) {
  const response = await apiClient.post<DataEnvelope<CampaignListItem>>(
    "/campaigns",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function setCampaignStatus(payload: {
  campaignId: string;
  status: "DRAFT" | "SCHEDULED" | "PAUSED" | "SENT" | "FAILED";
  scheduledAt?: string | null;
}) {
  const response = await apiClient.patch<DataEnvelope<CampaignListItem>>(
    "/campaigns",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function updateCampaign(payload: {
  campaignId: string;
  name?: string;
  type?: "BROADCAST" | "TRIGGERED" | "SEQUENCE";
  scheduledAt?: string | null;
  messageBody?: string | null;
  templateName?: string | null;
  audienceContactIds?: string[];
}) {
  const response = await apiClient.put<DataEnvelope<CampaignListItem>>(
    "/campaigns",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function duplicateCampaign(payload: {
  campaignId: string;
  newName?: string;
}) {
  const response = await apiClient.post<DataEnvelope<CampaignListItem>>(
    "/campaigns",
    {
      action: "duplicate",
      campaignId: payload.campaignId,
      newName: payload.newName,
    },
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function deleteCampaign(campaignId: string) {
  const response = await apiClient.delete<DataEnvelope<{ ok: boolean }>>(
    "/campaigns",
    {
      data: { campaignId },
    },
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}