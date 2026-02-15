/**
 * File: src/features/inbox/services/inbox.service.ts
 * Module: frontend-inbox
 * Purpose: Inbox domain service for conversations and AI helpers.
 * Author: Aman Sharma / Novologic/ Codex
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

