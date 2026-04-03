/**
 * File: src/features/audience/services/audience.service.ts
 * Module: frontend-audience
 * Purpose: API helpers for audience contacts and segment summaries.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { apiClient } from "@/lib/api-client";
import {
  AudienceContactItem,
  AudienceContactsResponse,
  AudienceSegmentItem,
  AudienceSegmentsResponse,
} from "@/types/api-contracts";

export async function fetchAudienceContacts(filters?: {
  search?: string;
  segmentId?: string;
}): Promise<AudienceContactItem[]> {
  const response = await apiClient.get<AudienceContactsResponse>("/audience", {
    params: {
      search: filters?.search || undefined,
      segmentId: filters?.segmentId || undefined,
    },
  });
  return response.data?.data || [];
}

export async function fetchAudienceSegments(): Promise<AudienceSegmentItem[]> {
  const response = await apiClient.get<AudienceSegmentsResponse>("/audience/segments");
  return response.data?.data || [];
}
