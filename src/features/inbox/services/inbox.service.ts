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
  ConversationsResponse,
} from "@/types/api-contracts";

export async function fetchConversations() {
  const response = await apiClient.get<ConversationsResponse>("/conversations");
  return response.data?.data || [];
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
  userId: string;
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

