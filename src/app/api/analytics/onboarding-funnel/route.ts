/**
 * File: src/app/api/analytics/onboarding-funnel/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for WhatsApp onboarding funnel analytics query.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Uses GraphQL query through backend proxy.
 * - Returns onboarding funnel buckets for dashboard widgets.
 */
import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { WHATSAPP_ONBOARDING_FUNNEL_BFF_QUERY } from "@/services/bff/graphql-queries";
import { WhatsAppOnboardingFunnelPayload } from "@/types/api-contracts";

type OnboardingFunnelGraphqlData = {
  whatsappOnboardingFunnel: {
    total: number;
    buckets: Array<{ status: string; count: number }>;
  };
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<OnboardingFunnelGraphqlData>(
      request,
      WHATSAPP_ONBOARDING_FUNNEL_BFF_QUERY,
    );
    const funnel: WhatsAppOnboardingFunnelPayload = {
      total: payload.whatsappOnboardingFunnel.total,
      byStatus: (payload.whatsappOnboardingFunnel.buckets || []).reduce<Record<string, number>>(
        (accumulator, bucket) => {
          accumulator[bucket.status] = bucket.count;
          return accumulator;
        },
        {},
      ),
    };
    return NextResponse.json({ data: funnel });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load onboarding funnel analytics",
      },
      { status: 502 },
    );
  }
}
