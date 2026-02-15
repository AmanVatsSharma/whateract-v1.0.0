"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, RefreshCw, TriangleAlert, Zap } from "lucide-react";
import type {
  CampaignListItem,
  CampaignsResponse,
  TenantStatsResponse,
} from "@/types/api-contracts";
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

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  severity: "info" | "success" | "warning";
  unread: boolean;
  createdAt: number;
};

export default function NotificationsPage() {
  const logger = useMemo(() => createLogger("notifications-page"), []);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsRefreshing(true);
    setLoadError(null);
    try {
      const [campaignsRes, overviewRes] = await Promise.all([
        fetch("/api/campaigns", { cache: "no-store" }),
        fetch("/api/analytics/overview", { cache: "no-store" }),
      ]);

      const campaignPayload = (await campaignsRes.json().catch(() => ({}))) as
        | CampaignsResponse
        | { error?: string };
      const overviewPayload = (await overviewRes.json().catch(() => ({}))) as {
        data?: TenantStatsResponse;
        error?: string;
      };

      const campaignList: CampaignListItem[] =
        "data" in campaignPayload && Array.isArray(campaignPayload.data)
          ? campaignPayload.data
          : [];
      const stats = overviewPayload.data;
      const now = Date.now();
      const next: NotificationItem[] = [];

      const activeCampaigns = campaignList.filter(
        (campaign) => String(campaign.status || "").toLowerCase() === "active",
      );
      if (activeCampaigns.length > 0) {
        next.push({
          id: "active-campaigns",
          title: "Active campaigns running",
          description: `${activeCampaigns.length} campaigns are currently active.`,
          severity: "success",
          unread: true,
          createdAt: now - 1000 * 60 * 5,
        });
      }

      if (stats && stats.messagesInbound > 0) {
        next.push({
          id: "inbound-replies",
          title: "Inbound replies detected",
          description: `${stats.messagesInbound} customer replies captured recently.`,
          severity: "info",
          unread: true,
          createdAt: now - 1000 * 60 * 15,
        });
      }

      if (stats && stats.campaignMessagesFailed && stats.campaignMessagesFailed > 0) {
        next.push({
          id: "campaign-failures",
          title: "Campaign delivery failures",
          description: `${stats.campaignMessagesFailed} messages failed and need attention.`,
          severity: "warning",
          unread: true,
          createdAt: now - 1000 * 60 * 25,
        });
      }

      if (next.length === 0) {
        next.push({
          id: "workspace-ready",
          title: "Workspace is quiet",
          description: "No urgent events right now. You are all caught up.",
          severity: "info",
          unread: false,
          createdAt: now - 1000 * 60 * 3,
        });
      }

      setNotifications(next.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown notifications loading error";
      logger.error("Notifications load failed", message);
      setLoadError(message);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [logger]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    );
  };

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
  };

  if (isLoading) {
    return <SectionLoader label="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Operational alerts and campaign events for your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={() => void loadNotifications()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loadError && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive">Load warning</CardTitle>
            <CardDescription className="text-destructive/90">
              {loadError}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event feed</CardTitle>
          <CardDescription>Events are generated from campaigns and analytics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`w-full rounded-lg border p-4 text-left transition hover:bg-muted/30 ${notification.unread ? "border-primary/30 bg-primary/5" : "border-border/70"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge
                  variant={notification.severity === "warning" ? "destructive" : "secondary"}
                  className="capitalize"
                >
                  {notification.severity}
                </Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Info events</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {notifications.filter((item) => item.severity === "info").length}
            </p>
            <Bell className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Success events</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {notifications.filter((item) => item.severity === "success").length}
            </p>
            <Zap className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {notifications.filter((item) => item.severity === "warning").length}
            </p>
            <TriangleAlert className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
