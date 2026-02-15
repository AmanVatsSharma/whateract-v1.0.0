import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { TENANT_STATS_BFF_QUERY } from "@/services/bff/graphql-queries";
import { TenantStatsResponse } from "@/types/api-contracts";

type TenantStatsGraphqlData = {
  tenantStats: TenantStatsResponse;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<TenantStatsGraphqlData>(
      request,
      TENANT_STATS_BFF_QUERY
    );
    return NextResponse.json({ data: payload.tenantStats });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load analytics overview",
      },
      { status: 502 }
    );
  }
}
