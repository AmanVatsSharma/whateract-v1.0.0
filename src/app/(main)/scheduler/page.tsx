"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarClock, RefreshCw, Timer, Zap } from "lucide-react";
import type { CampaignListItem, CampaignsResponse } from "@/types/api-contracts";
import { createLogger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionLoader } from "@/components/shared/section-loader";

export default function SchedulerPage() {
  const logger = useMemo(() => createLogger("scheduler-page"), []);
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setIsRefreshing(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/campaigns", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as
        | CampaignsResponse
        | { error?: string };

      if (!response.ok || !("data" in payload) || !Array.isArray(payload.data)) {
        const message =
          ("error" in payload && payload.error) ||
          `Unable to load campaigns (${response.status})`;
        throw new Error(message);
      }

      setCampaigns(payload.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown scheduler loading error";
      logger.error("Scheduler campaign load failed", message);
      setLoadError(message);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [logger]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  const scheduledCampaigns = useMemo(
    () =>
      campaigns
        .filter((campaign) => Boolean(campaign.scheduledAt))
        .sort(
          (a, b) =>
            new Date(a.scheduledAt || 0).getTime() -
            new Date(b.scheduledAt || 0).getTime(),
        ),
    [campaigns],
  );

  const activeCount = useMemo(
    () =>
      campaigns.filter(
        (campaign) => String(campaign.status || "").toLowerCase() === "active",
      ).length,
    [campaigns],
  );

  if (isLoading) {
    return <SectionLoader label="Loading scheduler timeline..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scheduler</h1>
          <p className="text-muted-foreground">
            Plan campaign dispatch windows and monitor queued sends.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadCampaigns()} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh timeline"}
        </Button>
      </div>

      {loadError && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive">Scheduler warning</CardTitle>
            <CardDescription className="text-destructive/90">
              {loadError}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Queued campaigns</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">{scheduledCampaigns.length}</p>
            <CalendarClock className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active campaigns</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">{activeCount}</p>
            <Zap className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending actions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">{Math.max(0, scheduledCampaigns.length - 3)}</p>
            <Timer className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming dispatches</CardTitle>
          <CardDescription>
            Scheduled campaigns sorted by nearest execution time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scheduledCampaigns.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              No scheduled campaigns found. Use the campaign builder to set `scheduledAt`
              timestamps.
            </div>
          ) : (
            scheduledCampaigns.slice(0, 10).map((campaign) => {
              const scheduleTime = new Date(campaign.scheduledAt || "");
              return (
                <div
                  key={campaign.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Dispatch {formatDistanceToNow(scheduleTime, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {String(campaign.status || "scheduled").toLowerCase()}
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
