/**
 * File: src/app/(main)/analytics/page.tsx
 * Module: analytics-page
 * Purpose: API-backed analytics screen with strict empty/error handling.
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
import type { CampaignKpiItem, TenantStatsResponse } from "@/types/api-contracts";

type AnalyticsState = {
  stats: TenantStatsResponse;
  campaignKpis: CampaignKpiItem[];
  onboardingByStatus: Record<string, number>;
};

const EMPTY_STATE: AnalyticsState = {
  stats: {
    totalContacts: 0,
    totalConversations: 0,
    messagesSent: 0,
    messagesInbound: 0,
    totalCampaigns: 0,
    campaignMessagesSent: 0,
    campaignMessagesFailed: 0,
    campaignReplyRate: 0,
  },
  campaignKpis: [],
  onboardingByStatus: {},
};

export default function AnalyticsPage() {
  const [state, setState] = useState<AnalyticsState>(EMPTY_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage("");
      const [statsRes, kpisRes, funnelRes] = await Promise.all([
        fetch("/api/analytics/overview", { cache: "no-store" }),
        fetch("/api/analytics/campaign-kpis", { cache: "no-store" }),
        fetch("/api/analytics/onboarding-funnel", { cache: "no-store" }),
      ]);
      const statsPayload = (await statsRes.json().catch(() => ({}))) as {
        data?: TenantStatsResponse;
        error?: string;
      };
      const kpisPayload = (await kpisRes.json().catch(() => ({}))) as {
        data?: CampaignKpiItem[];
        error?: string;
      };
      const funnelPayload = (await funnelRes.json().catch(() => ({}))) as {
        data?: { byStatus?: Record<string, number> };
        error?: string;
      };

      if (!statsRes.ok) {
        throw new Error(statsPayload.error || `Overview request failed (${statsRes.status})`);
      }
      if (!kpisRes.ok) {
        throw new Error(kpisPayload.error || `KPI request failed (${kpisRes.status})`);
      }
      if (!funnelRes.ok) {
        throw new Error(funnelPayload.error || `Funnel request failed (${funnelRes.status})`);
      }

      setState({
        stats: statsPayload.data || EMPTY_STATE.stats,
        campaignKpis: Array.isArray(kpisPayload.data) ? kpisPayload.data : [],
        onboardingByStatus: funnelPayload.data?.byStatus || {},
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Analytics load failed");
      setState(EMPTY_STATE);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const campaignChartData = useMemo(
    () =>
      state.campaignKpis.map((kpi) => ({
        name: kpi.campaignName || kpi.campaignId,
        sent: kpi.outboundSent,
        replies: kpi.inboundReplies,
      })),
    [state.campaignKpis],
  );

  const onboardingStatusRows = useMemo(
    () =>
      Object.entries(state.onboardingByStatus)
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
    [state.onboardingByStatus],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Campaign and onboarding analytics sourced from live APIs only.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={isRefreshing}
          onClick={() => {
            void loadAnalytics();
          }}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load analytics</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Contacts" value={state.stats.totalContacts.toLocaleString()} />
        <MetricCard title="Conversations" value={state.stats.totalConversations.toLocaleString()} />
        <MetricCard title="Messages Sent" value={state.stats.messagesSent.toLocaleString()} />
        <MetricCard title="Inbound Replies" value={state.stats.messagesInbound.toLocaleString()} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Throughput</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading campaign metrics..."
                : campaignChartData.length
                  ? "Outbound sent vs inbound replies by campaign."
                  : "No campaign KPI records found."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            ) : campaignChartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="replies" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                Trigger campaigns and message sends to populate this section.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Funnel</CardTitle>
            <CardDescription>Tenant count per onboarding status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading funnel...</p>
            ) : onboardingStatusRows.length ? (
              onboardingStatusRows.map((row) => (
                <div
                  key={row.status}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <span className="text-sm font-medium">{row.status}</span>
                  <Badge variant="secondary">{row.count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No onboarding status data available yet.
              </p>
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
