/**
 * File: src/types/api-contracts.ts
 * Module: frontend-shared-types
 * Purpose: Central typed contracts for BFF route responses.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Keep BFF route payloads aligned with backend capabilities.
 * - Read this file before editing any src/app/api/* handlers.
 */

export interface CampaignListItem {
  id: string;
  name: string;
  type: string;
  status: string;
  scheduledAt?: string | null;
  createdAt?: string | null;
}

export interface ApiDataEnvelope<T> {
  data: T;
}

export interface ApiErrorEnvelope {
  error: string;
}

export interface CampaignsResponse {
  data: CampaignListItem[];
}

export interface AutomationListItem {
  id: string;
  type: string;
  enabled: boolean;
  trigger?: string | null;
  createdAt?: string | null;
}

export interface AutomationsResponse {
  data: AutomationListItem[];
}

export interface ConversationListItem {
  id: string;
  contactId?: string | null;
  status: "OPEN" | "PENDING" | "CLOSED";
  assignedUserId?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  tags: string[];
}

export interface ConversationsResponse {
  data: ConversationListItem[];
}

export interface AiReplyResponse {
  suggestion: string;
}

export interface AiGenerateResponse {
  content: string;
}

export interface AiSummarizeResponse {
  summary: string;
}

export interface TenantStatsResponse {
  totalContacts: number;
  totalConversations: number;
  messagesSent: number;
  messagesInbound: number;
  totalCampaigns?: number;
  campaignMessagesSent?: number;
  campaignMessagesFailed?: number;
  campaignReplyRate?: number;
}

export interface CampaignKpiItem {
  campaignId: string;
  campaignName: string;
  outboundSent: number;
  outboundFailed: number;
  inboundReplies: number;
  replyRate: number;
}

export interface CampaignKpisResponse {
  data: CampaignKpiItem[];
}

export interface WhatsAppOnboardingChecklistItem {
  key: string;
  label: string;
  done: boolean;
  blocker?: string;
}

export interface WhatsAppOnboardingStatusPayload {
  tenantId: string;
  status: string;
  businessLegalName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  expectedDailyVolume?: number | null;
  reviewNotes?: string | null;
  phoneNumberId?: string | null;
  phoneNumberE164?: string | null;
  wabaId?: string | null;
  webhookVerifiedAt?: string | null;
  activatedAt?: string | null;
  suspendedAt?: string | null;
  onboardingSlaTargetAt?: string | null;
  approvedTemplates: number;
  checklist: WhatsAppOnboardingChecklistItem[];
  blockers: string[];
}

export interface ManagedWhatsAppNumberPayload {
  id: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  status: string;
  assignedTenantId?: string | null;
  wabaId?: string | null;
  qualityRating?: string | null;
  assignedAt?: string | null;
  releasedAt?: string | null;
}

export interface ManagedWhatsAppChannelPayload {
  tenantId: string;
  status: string;
  phoneNumberId?: string | null;
  phoneNumberE164?: string | null;
  businessLegalName?: string | null;
  webhookVerifiedAt?: string | null;
  activatedAt?: string | null;
  suspendedAt?: string | null;
  onboardingSlaTargetAt?: string | null;
  updatedAt?: string | null;
}

export interface WhatsAppOnboardingFunnelPayload {
  total: number;
  byStatus: Record<string, number>;
}

