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

export interface CampaignsResponse {
  data: CampaignListItem[];
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

