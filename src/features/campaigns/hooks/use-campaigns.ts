/**
 * File: src/features/campaigns/hooks/use-campaigns.ts
 * Module: frontend-campaigns
 * Purpose: React Query hook for campaigns list data.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Centralizes query key and stale policy.
 * - Use this hook instead of fetching directly inside page components.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchCampaigns } from "../services/campaigns.service";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
    staleTime: 30 * 1000,
  });
}

