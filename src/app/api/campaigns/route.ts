import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import {
  CAMPAIGNS_BFF_QUERY,
  CREATE_CAMPAIGN_BFF_MUTATION,
  DELETE_CAMPAIGN_BFF_MUTATION,
  SET_CAMPAIGN_STATUS_BFF_MUTATION,
} from "@/services/bff/graphql-queries";
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

type CampaignMutationData = {
  createCampaign: CampaignsGraphqlData["campaigns"][number];
  setCampaignStatus: CampaignsGraphqlData["campaigns"][number];
  deleteCampaign: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      type?: string;
      scheduledAt?: string | null;
    };
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "name and type are required" },
        { status: 400 },
      );
    }
    const payload = await proxyGraphql<CampaignMutationData>(
      request,
      CREATE_CAMPAIGN_BFF_MUTATION,
      {
        input: {
          name: body.name,
          type: body.type,
          scheduledAt: body.scheduledAt || null,
        },
      },
    );
    return NextResponse.json({ data: payload.createCampaign });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create campaign",
      },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      campaignId?: string;
      status?: "DRAFT" | "SCHEDULED" | "SENT" | "FAILED";
      scheduledAt?: string | null;
    };
    if (!body.campaignId || !body.status) {
      return NextResponse.json(
        { error: "campaignId and status are required" },
        { status: 400 },
      );
    }
    const payload = await proxyGraphql<CampaignMutationData>(
      request,
      SET_CAMPAIGN_STATUS_BFF_MUTATION,
      {
        campaignId: body.campaignId,
        status: body.status,
        scheduledAt: body.scheduledAt || null,
      },
    );
    return NextResponse.json({ data: payload.setCampaignStatus });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update campaign status",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      campaignId?: string;
    };
    if (!body.campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
    }
    const payload = await proxyGraphql<CampaignMutationData>(
      request,
      DELETE_CAMPAIGN_BFF_MUTATION,
      { campaignId: body.campaignId },
    );
    return NextResponse.json({ data: { ok: Boolean(payload.deleteCampaign) } });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete campaign",
      },
      { status: 502 },
    );
  }
}
