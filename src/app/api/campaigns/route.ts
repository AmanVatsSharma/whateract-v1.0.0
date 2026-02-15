import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { CAMPAIGNS_BFF_QUERY } from "@/services/bff/graphql-queries";
import { CampaignsResponse } from "@/types/api-contracts";

type CampaignsGraphqlData = {
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    scheduledAt?: string | null;
    createdAt?: string | null;
  }>;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<CampaignsGraphqlData>(
      request,
      CAMPAIGNS_BFF_QUERY
    );

    const response: CampaignsResponse = {
      data: payload.campaigns || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load campaigns",
      },
      { status: 502 }
    );
  }
}
