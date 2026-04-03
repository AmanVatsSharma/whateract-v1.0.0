/**
 * File: src/features/inbox/hooks/use-conversations.ts
 * Module: frontend-inbox
 * Purpose: React Query hook for inbox conversation list.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Keeps conversation fetching out of page components.
 * - Provides shared caching behavior for inbox views.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../services/inbox.service";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(),
    staleTime: 15 * 1000,
  });
}

