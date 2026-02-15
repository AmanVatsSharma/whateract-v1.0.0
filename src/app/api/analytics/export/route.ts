import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { TENANT_STATS_BFF_QUERY } from "@/services/bff/graphql-queries";
import { TenantStatsResponse } from "@/types/api-contracts";

type TenantStatsGraphqlData = {
  tenantStats: TenantStatsResponse;
};

export async function GET(request: Request) {
  try {
    const data = await proxyGraphql<TenantStatsGraphqlData>(
      request,
      TENANT_STATS_BFF_QUERY
    );

    const rows = [
      ["Metric", "Value"],
      ["Total Contacts", String(data.tenantStats.totalContacts ?? 0)],
      ["Total Conversations", String(data.tenantStats.totalConversations ?? 0)],
      ["Messages Sent", String(data.tenantStats.messagesSent ?? 0)],
      ["Messages Inbound", String(data.tenantStats.messagesInbound ?? 0)],
      ["Total Campaigns", String(data.tenantStats.totalCampaigns ?? 0)],
      ["Campaign Messages Sent", String(data.tenantStats.campaignMessagesSent ?? 0)],
      ["Campaign Messages Failed", String(data.tenantStats.campaignMessagesFailed ?? 0)],
      ["Campaign Reply Rate (%)", String(data.tenantStats.campaignReplyRate ?? 0)],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=analytics.csv",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to export analytics",
      },
      { status: 502 }
    );
  }
}
