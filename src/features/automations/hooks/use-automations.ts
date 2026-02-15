/**
 * File: src/features/automations/hooks/use-automations.ts
 * Module: frontend-automations
 * Purpose: React Query hook for automation listing cache.
 * Author: BharatERP
 * created: 2026-02-15
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAutomations } from "../services/automations.service";

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: fetchAutomations,
    staleTime: 20 * 1000,
  });
}
