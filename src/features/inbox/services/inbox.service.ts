/**
 * File: src/features/inbox/services/inbox.service.ts
 * Module: frontend-inbox
 * Purpose: Inbox domain service for conversations and AI helpers.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - BFF endpoints abstract backend route differences.
 * - Keep all inbox HTTP calls in this service.
 */

import { apiClient } from "@/lib/api-client";
import {
  AiReplyResponse,
  AiSummarizeResponse,
  ConversationListItem,
  ConversationThreadPayload,
  ConversationsResponse,
} from "@/types/api-contracts";

export async function fetchConversations(filters?: {
  search?: string;
  status?: "OPEN" | "PENDING" | "CLOSED";
  assignedUserId?: string;
  tag?: string;
}) {
  const response = await apiClient.get<ConversationsResponse>("/conversations", {
    params: {
      search: filters?.search || undefined,
      status: filters?.status || undefined,
      assignedUserId: filters?.assignedUserId || undefined,
      tag: filters?.tag || undefined,
    },
  });
  return response.data?.data || [];
}

export async function fetchConversationThread(conversationId: string) {
  const response = await apiClient.get<{ data?: ConversationThreadPayload; error?: string }>(
    `/conversations/${conversationId}`,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || null;
}

export async function fetchAiReply(payload: {
  text: string;
  conversationId?: string;
}) {
  const response = await apiClient.post<AiReplyResponse>("/ai/reply", payload);
  return response.data?.suggestion || "";
}

export async function summarizeConversation(payload: {
  conversationId?: string;
}) {
  const response = await apiClient.post<AiSummarizeResponse>(
    "/ai/summarize",
    payload
  );
  return response.data?.summary || "";
}

export async function assignConversation(payload: {
  conversationId: string;
  userId?: string | null;
}) {
  const response = await apiClient.patch<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    ...payload,
    action: "assign",
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export async function setConversationStatus(payload: {
  conversationId: string;
  status: "OPEN" | "PENDING" | "CLOSED";
}) {
  const response = await apiClient.patch<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    ...payload,
    action: "status",
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export async function addConversationNote(payload: {
  conversationId: string;
  content: string;
}) {
  const response = await apiClient.post<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    ...payload,
    action: "note",
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export async function tagConversation(payload: {
  conversationId: string;
  tag: string;
}) {
  const response = await apiClient.post<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    ...payload,
    action: "tag",
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export async function untagConversation(payload: {
  conversationId: string;
  tag: string;
}) {
  const response = await apiClient.delete<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    data: {
      ...payload,
      action: "untag",
    },
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export async function sendConversationMessage(payload: {
  conversationId: string;
  message: string;
}) {
  const response = await apiClient.post<{
    data?: { ok?: boolean };
    error?: string;
  }>("/conversations", {
    ...payload,
    action: "message",
  });
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}

export type AssignableMember = {
  id: string;
  userId: string;
  userEmail?: string | null;
  role?: string;
  teamName?: string;
};

export async function fetchAssignableMembers(): Promise<AssignableMember[]> {
  const response = await apiClient.get<
    AssignableMember[] | { data?: AssignableMember[]; error?: string }
  >("/team-onboarding/members");
  const body = response.data;
  if (body && typeof body === "object" && !Array.isArray(body) && body.error) {
    throw new Error(body.error);
  }
  if (Array.isArray(body)) {
    return body;
  }
  if (body && typeof body === "object" && Array.isArray(body.data)) {
    return body.data;
  }
  return [];
}

export function getConversationLabel(conversation: ConversationListItem) {
  const contactName = `${conversation.contactName || ""}`.trim();
  if (contactName) {
    return `${contactName} (${conversation.contactPhone || conversation.contactId || conversation.id})`;
  }
  return conversation.contactPhone || conversation.contactId || conversation.id;
}