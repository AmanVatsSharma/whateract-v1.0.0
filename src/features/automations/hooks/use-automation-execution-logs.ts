/**
 * File: src/features/automations/hooks/use-automation-execution-logs.ts
 * Module: frontend-automations
 * Purpose: React Query hook for automation execution logs.
 * Author: BharatERP
 * created: 2026-02-16
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAutomationExecutionLogs } from "../services/automations.service";

export function useAutomationExecutionLogs(automationId?: string) {
  return useQuery({
    queryKey: ["automation-execution-logs", automationId || "all"],
    queryFn: () => fetchAutomationExecutionLogs(automationId),
    staleTime: 15 * 1000,
  });
}
