/**
 * File: src/app/api/conversations/[conversationId]/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for inbox conversation thread retrieval.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { relayJsonResponse } from "@/services/bff/backend-proxy";

type RouteParams = {
  params: Promise<{ conversationId: string }>;
};

export async function GET(request: Request, context: RouteParams) {
  const { conversationId } = await context.params;
  return relayJsonResponse(request, `/inbox/conversations/${conversationId}/thread`);
}
