import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { AUTOMATIONS_BFF_QUERY } from "@/services/bff/graphql-queries";

type AutomationsGraphqlData = {
  automations: Array<{
    id: string;
    type: string;
    enabled: boolean;
    trigger?: string | null;
    createdAt?: string | null;
  }>;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<AutomationsGraphqlData>(
      request,
      AUTOMATIONS_BFF_QUERY
    );
    return NextResponse.json({ data: payload.automations || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load automations",
      },
      { status: 502 }
    );
  }
}
