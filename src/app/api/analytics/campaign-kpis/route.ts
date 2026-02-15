import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { CAMPAIGN_KPIS_BFF_QUERY } from "@/services/bff/graphql-queries";
import { CampaignKpiItem } from "@/types/api-contracts";

type CampaignKpisGraphqlData = {
  campaignKpis: CampaignKpiItem[];
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<CampaignKpisGraphqlData>(
      request,
      CAMPAIGN_KPIS_BFF_QUERY
    );
    return NextResponse.json({ data: payload.campaignKpis || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load campaign analytics",
      },
      { status: 502 }
    );
  }
}
