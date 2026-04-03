/**
 * File: src/app/api/automations/logs/route.ts
 * Module: frontend-automations
 * Purpose: BFF route to fetch automation execution logs.
 * Author: BharatERP
 * created: 2026-02-16
 */

import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { AUTOMATION_EXECUTION_LOGS_BFF_QUERY } from "@/services/bff/graphql-queries";

type AutomationExecutionLogsGraphqlData = {
  automationExecutionLogs: Array<{
    id: string;
    automationId?: string | null;
    automationType: string;
    triggerSource: string;
    status: string;
    recipient?: string | null;
    messagePreview?: string | null;
    detailsJson?: string | null;
    createdAt?: string | null;
  }>;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const automationId = url.searchParams.get("automationId");
    const payload = await proxyGraphql<AutomationExecutionLogsGraphqlData>(
      request,
      AUTOMATION_EXECUTION_LOGS_BFF_QUERY,
      {
        automationId: automationId || null,
      },
    );
    return NextResponse.json({ data: payload.automationExecutionLogs || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load automation execution logs",
      },
      { status: 502 },
    );
  }
}
