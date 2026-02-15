/**
 * File: src/features/automations/services/automations.service.ts
 * Module: frontend-automations
 * Purpose: API service for automation CRUD and enable/disable actions.
 * Author: BharatERP
 * created: 2026-02-15
 */

import { apiClient } from "@/lib/api-client";
import { AutomationListItem, AutomationsResponse } from "@/types/api-contracts";

type DataEnvelope<T> = {
  data?: T;
  error?: string;
};

export async function fetchAutomations(): Promise<AutomationListItem[]> {
  const response = await apiClient.get<AutomationsResponse>("/automations");
  return response.data?.data || [];
}

export async function createAutomation(payload: {
  type: string;
  trigger?: string;
  enabled?: boolean;
  definition?: Record<string, unknown>;
}) {
  const response = await apiClient.post<DataEnvelope<AutomationListItem>>(
    "/automations",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function updateAutomation(payload: {
  automationId: string;
  type?: string;
  trigger?: string;
  enabled?: boolean;
  definition?: Record<string, unknown>;
}) {
  const response = await apiClient.patch<DataEnvelope<AutomationListItem>>(
    "/automations",
    payload,
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data;
}

export async function setAutomationEnabled(
  automationId: string,
  enabled: boolean,
) {
  return updateAutomation({ automationId, enabled });
}

export async function deleteAutomation(automationId: string) {
  const response = await apiClient.delete<DataEnvelope<{ ok: boolean }>>(
    "/automations",
    {
      data: { automationId },
    },
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return Boolean(response.data?.data?.ok);
}
