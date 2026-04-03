/**
 * File: src/app/(main)/dashboard/page.tsx
 * Module: dashboard-page
 * Purpose: API-first dashboard with explicit loading, error, and empty states.
 * Author: BharatERP
 * created: 2026-02-16
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionLoader } from "@/components/shared/section-loader";
import type { CampaignListItem, TenantStatsResponse } from "@/types/api-contracts";

type DashboardPayload = {
  stats: TenantStatsResponse;
  campaigns: CampaignListItem[];
};

const EMPTY_STATS: TenantStatsResponse = {
  totalContacts: 0,
  totalConversations: 0,
  messagesSent: 0,
  messagesInbound: 0,
  totalCampaigns: 0,
  campaignMessagesSent: 0,
  campaignMessagesFailed: 0,
  campaignReplyRate: 0,
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardPayload>({
    stats: EMPTY_STATS,
    campaigns: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setErrorMessage("");
      setIsRefreshing(true);
      const [statsResponse, campaignsResponse] = await Promise.all([
        fetch("/api/analytics/overview", { cache: "no-store" }),
        fetch("/api/campaigns", { cache: "no-store" }),
      ]);
      const statsPayload = (await statsResponse.json().catch(() => ({}))) as {
        data?: TenantStatsResponse;
        error?: string;
      };
      const campaignsPayload = (await campaignsResponse.json().catch(() => ({}))) as {
        data?: CampaignListItem[];
        error?: string;
      };

      if (!statsResponse.ok) {
        throw new Error(statsPayload.error || `Dashboard stats failed (${statsResponse.status})`);
      }
      if (!campaignsResponse.ok) {
        throw new Error(
          campaignsPayload.error || `Dashboard campaigns failed (${campaignsResponse.status})`,
        );
      }

      setData({
        stats: statsPayload.data || EMPTY_STATS,
        campaigns: Array.isArray(campaignsPayload.data) ? campaignsPayload.data : [],
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Dashboard load failed");
      setData({
        stats: EMPTY_STATS,
        campaigns: [],
      });
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const statusChartData = useMemo(() => {
    const statusCount = new Map<string, number>();
    data.campaigns.forEach((campaign) => {
      const status = String(campaign.status || "UNKNOWN").toUpperCase();
      statusCount.set(status, (statusCount.get(status) || 0) + 1);
    });
    return Array.from(statusCount.entries()).map(([status, count]) => ({
      status,
      count,
    }));
  }, [data.campaigns]);

  const replyRate = useMemo(() => {
    if (!data.stats.messagesSent) {
      return 0;
    }
    return Number(
      ((data.stats.messagesInbound / Math.max(1, data.stats.messagesSent)) * 100).toFixed(1),
    );
  }, [data.stats.messagesInbound, data.stats.messagesSent]);

  if (isLoading) {
    return <SectionLoader label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real tenant metrics from analytics and campaigns services.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={isRefreshing}
          onClick={() => {
            void loadDashboard();
          }}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load dashboard</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Contacts" value={data.stats.totalContacts.toLocaleString()} />
        <MetricCard title="Messages Sent" value={data.stats.messagesSent.toLocaleString()} />
        <MetricCard title="Active Campaigns" value={String(data.campaigns.length)} />
        <MetricCard title="Reply Rate" value={`${replyRate}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Status Distribution</CardTitle>
            <CardDescription>
              {statusChartData.length
                ? "Campaigns grouped by current status."
                : "No campaign records available for this tenant."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusChartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start by creating campaigns to view status distribution.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest campaign records from backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No campaigns found for this tenant.
              </p>
            ) : (
              data.campaigns.slice(0, 6).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{campaign.name || campaign.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.createdAt?.slice(0, 10) || "-"}
                    </p>
                  </div>
                  <Badge variant="secondary">{String(campaign.status || "UNKNOWN")}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard(props: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{props.value}</p>
      </CardContent>
    </Card>
  );
}
