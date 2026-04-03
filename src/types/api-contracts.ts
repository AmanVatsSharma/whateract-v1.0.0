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
  messageBody?: string | null;
  templateName?: string | null;
  audienceContactIds?: string[] | null;
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

export interface AudienceContactItem {
  id: string;
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
  userId: string;
  subscribed?: boolean;
  tags?: string[] | null;
  createdAt?: string | null;
}

export interface AudienceContactsResponse {
  data: AudienceContactItem[];
}

export interface AudienceSegmentItem {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface AudienceSegmentsResponse {
  data: AudienceSegmentItem[];
}

export interface AutomationListItem {
  id: string;
  type: string;
  enabled: boolean;
  trigger?: string | null;
  definitionJson?: string | null;
  stepsCount?: number;
  conditionsCount?: number;
  createdAt?: string | null;
}

export interface AutomationsResponse {
  data: AutomationListItem[];
}

export interface AutomationExecutionLogItem {
  id: string;
  automationId?: string | null;
  automationType: string;
  triggerSource: string;
  status: string;
  recipient?: string | null;
  messagePreview?: string | null;
  detailsJson?: string | null;
  createdAt?: string | null;
}

export interface AutomationExecutionLogsResponse {
  data: AutomationExecutionLogItem[];
}

export interface ConversationListItem {
  id: string;
  contactId?: string | null;
  contactPhone?: string | null;
  contactName?: string | null;
  status: "OPEN" | "PENDING" | "CLOSED";
  assignedUserId?: string | null;
  assignedUserEmail?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  tags: string[];
}

export interface ConversationsResponse {
  data: ConversationListItem[];
}

export interface ConversationThreadMessageItem {
  id: string;
  content: string;
  direction?: "INBOUND" | "OUTBOUND" | null;
  status?: "DRAFT" | "SENT" | "FAILED" | null;
  createdAt: string;
  from?: string | null;
  to?: string | null;
}

export interface ConversationThreadNoteItem {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface ConversationThreadPayload {
  id: string;
  contactId: string;
  contactPhone?: string | null;
  status: "OPEN" | "PENDING" | "CLOSED";
  assignedUserId?: string | null;
  tags: string[];
  messages: ConversationThreadMessageItem[];
  notes: ConversationThreadNoteItem[];
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
  obaEligible?: boolean;
  obaStatus?: string;
  obaAppliedAt?: string | null;
  obaApprovedAt?: string | null;
  obaRejectedAt?: string | null;
  obaReviewNotes?: string | null;
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
  obaEligible?: boolean;
  obaStatus?: string;
  obaAppliedAt?: string | null;
  obaApprovedAt?: string | null;
  obaRejectedAt?: string | null;
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

