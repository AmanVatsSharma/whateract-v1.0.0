import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/backend/backend-proxy";
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

const CAMPAIGNS_QUERY = `
  query CampaignsBffList {
    campaigns {
      id
      name
      status
      type
      scheduledAt
      createdAt
    }
  }
`;

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<CampaignsGraphqlData>(
      request,
      CAMPAIGNS_QUERY
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
