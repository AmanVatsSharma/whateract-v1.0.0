/**
 * File: src/features/settings/services/whatsapp-onboarding.service.ts
 * Module: frontend-settings
 * Purpose: Frontend service wrapper for managed WhatsApp onboarding APIs.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Calls BFF endpoints under `/api/whatsapp-onboarding/*`.
 * - Used by settings and analytics operational widgets.
 */
import { apiClient } from "@/lib/api-client";
import {
  ManagedWhatsAppChannelPayload,
  ManagedWhatsAppNumberPayload,
  WhatsAppOnboardingFunnelPayload,
  WhatsAppOnboardingStatusPayload,
} from "@/types/api-contracts";

type DataEnvelope<T> = {
  data?: T;
  error?: string;
};

export async function getWhatsAppOnboardingStatus() {
  const response = await apiClient.get<DataEnvelope<WhatsAppOnboardingStatusPayload>>(
    "/whatsapp-onboarding/status",
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function submitWhatsAppOnboardingRequest(payload: {
  businessLegalName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  expectedDailyVolume?: number;
  reviewNotes?: string;
}) {
  const response = await apiClient.post<DataEnvelope<WhatsAppOnboardingStatusPayload>>(
    "/whatsapp-onboarding/request",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function listManagedWhatsAppNumbers(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await apiClient.get<DataEnvelope<ManagedWhatsAppNumberPayload[]>>(
    `/whatsapp-onboarding/operator/numbers${query}`,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || [];
}

export async function upsertManagedWhatsAppNumber(payload: {
  phoneNumberId: string;
  displayPhoneNumber: string;
  status?: string;
  wabaId?: string;
  businessAccountId?: string;
  qualityRating?: string;
}) {
  const response = await apiClient.post<DataEnvelope<ManagedWhatsAppNumberPayload>>(
    "/whatsapp-onboarding/operator/numbers",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function assignManagedWhatsAppNumber(payload: {
  tenantId: string;
  phoneNumberId: string;
  forceReassign?: boolean;
  activateNow?: boolean;
  reason?: string;
}) {
  const response = await apiClient.post<DataEnvelope<WhatsAppOnboardingStatusPayload>>(
    "/whatsapp-onboarding/operator/assign",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function setManagedWhatsAppChannelStatus(payload: {
  tenantId: string;
  status: string;
  reviewNotes?: string;
  displayNameStatus?: string;
  qualityRating?: string;
  reason?: string;
}) {
  const response = await apiClient.post<DataEnvelope<WhatsAppOnboardingStatusPayload>>(
    "/whatsapp-onboarding/operator/channel-status",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function setManagedWhatsAppObaStatus(payload: {
  tenantId: string;
  obaStatus: "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  reviewNotes?: string;
}) {
  const response = await apiClient.post<DataEnvelope<WhatsAppOnboardingStatusPayload>>(
    "/whatsapp-onboarding/operator/oba-status",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function listManagedWhatsAppChannels(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await apiClient.get<DataEnvelope<ManagedWhatsAppChannelPayload[]>>(
    `/whatsapp-onboarding/operator/channels${query}`,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || [];
}

export async function getWhatsAppOnboardingFunnel() {
  const response = await apiClient.get<DataEnvelope<WhatsAppOnboardingFunnelPayload>>(
    "/whatsapp-onboarding/operator/funnel",
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}
