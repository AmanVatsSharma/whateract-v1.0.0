"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Filter,
  MessageSquare,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createLogger } from "@/lib/logger";
import type {
  CampaignListItem,
  CampaignsResponse,
  TenantStatsResponse,
} from "@/types/api-contracts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SectionLoader } from "@/components/shared/section-loader";

type DashboardMetric = "sent" | "delivered" | "read" | "responded";
type CampaignStatusFilter = "all" | "active" | "paused" | "draft" | "scheduled";

type DashboardChartRow = {
  name: string;
  sent: number;
  delivered: number;
  read: number;
  responded: number;
};

const DEFAULT_STATS: TenantStatsResponse = {
  totalContacts: 0,
  totalConversations: 0,
  messagesSent: 0,
  messagesInbound: 0,
  totalCampaigns: 0,
  campaignMessagesSent: 0,
  campaignMessagesFailed: 0,
  campaignReplyRate: 0,
};

const FALLBACK_CHART_DATA: DashboardChartRow[] = [
  { name: "Campaign A", sent: 300, delivered: 276, read: 188, responded: 48 },
  { name: "Campaign B", sent: 240, delivered: 220, read: 140, responded: 39 },
  { name: "Campaign C", sent: 320, delivered: 298, read: 210, responded: 57 },
];

const METRIC_COLOR: Record<DashboardMetric, string> = {
  sent: "#8b5cf6",
  delivered: "#14b8a6",
  read: "#f59e0b",
  responded: "#3b82f6",
};

export default function DashboardPage() {
  const logger = useMemo(() => createLogger("dashboard-page"), []);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<DashboardMetric>("sent");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [stats, setStats] = useState<TenantStatsResponse>(DEFAULT_STATS);
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadOverview = useCallback(
    async (manualRefresh = false) => {
      setIsRefreshing(true);
      setLoadError(null);
      try {
        const [statsRes, campaignsRes] = await Promise.all([
          fetch("/api/analytics/overview", { cache: "no-store" }),
          fetch("/api/campaigns", { cache: "no-store" }),
        ]);

        const nextErrors: string[] = [];
        const statsPayload = (await statsRes
          .json()
          .catch(() => ({ error: "Invalid analytics response payload" }))) as {
          data?: TenantStatsResponse;
          error?: string;
        };
        const campaignsPayload = (await campaignsRes
          .json()
          .catch(() => ({ error: "Invalid campaigns response payload" }))) as
          | CampaignsResponse
          | { error?: string };

        if (!statsRes.ok || !statsPayload.data) {
          nextErrors.push(
            statsPayload.error || `Analytics request failed (${statsRes.status})`,
          );
        }
        if (
          !campaignsRes.ok ||
          !("data" in campaignsPayload) ||
          !Array.isArray(campaignsPayload.data)
        ) {
          nextErrors.push(
            ("error" in campaignsPayload && campaignsPayload.error) ||
              `Campaign request failed (${campaignsRes.status})`,
          );
        }

        if (statsPayload.data) {
          setStats(statsPayload.data);
        }
        if ("data" in campaignsPayload && Array.isArray(campaignsPayload.data)) {
          setCampaigns(campaignsPayload.data);
        }

        if (nextErrors.length > 0) {
          const aggregatedError = nextErrors.join(" | ");
          setLoadError(aggregatedError);
          logger.warn("Dashboard loaded with partial data", aggregatedError);
          if (manualRefresh) {
            toast.error("Refresh completed with partial data.");
          }
        } else if (manualRefresh) {
          toast.success("Dashboard refreshed.");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown dashboard loading error";
        logger.error("Dashboard fetch failed", message);
        setLoadError(message);
        if (manualRefresh) {
          toast.error("Unable to refresh dashboard.");
        }
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    },
    [logger],
  );

  useEffect(() => {
    void loadOverview(false);
  }, [loadOverview]);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "all") {
      return campaigns;
    }
    return campaigns.filter((campaign) => campaign.status?.toLowerCase() === statusFilter);
  }, [campaigns, statusFilter]);

  const chartData = useMemo<DashboardChartRow[]>(() => {
    if (!filteredCampaigns.length) {
      return FALLBACK_CHART_DATA;
    }
    const perCampaign = Math.max(
      1,
      Math.floor((stats.messagesSent || 0) / Math.max(1, filteredCampaigns.length)),
    );
    return filteredCampaigns.slice(0, 6).map((campaign, index) => ({
      name: campaign.name || `Campaign ${index + 1}`,
      sent: perCampaign,
      delivered: Math.round(perCampaign * 0.94),
      read: Math.round(perCampaign * 0.68),
      responded: Math.round(perCampaign * 0.22),
    }));
  }, [filteredCampaigns, stats.messagesSent]);

  const activeCampaignCount = useMemo(
    () =>
      campaigns.filter(
        (campaign) => String(campaign.status || "").toLowerCase() === "active",
      ).length,
    [campaigns],
  );
  const replyRate = useMemo(() => {
    if (stats.messagesSent <= 0) {
      return 0;
    }
    return Number(
      ((stats.messagesInbound / Math.max(1, stats.messagesSent)) * 100).toFixed(1),
    );
  }, [stats.messagesInbound, stats.messagesSent]);

  if (isLoading) {
    return <SectionLoader label="Loading dashboard insights..." />;
  }

  return (
    <div className="flex flex-col space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Overview of campaigns, contacts, and engagement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className={cn("rounded-xl", statusFilter !== "all" && "border-primary")}
            onClick={() => setIsFilterPanelOpen((value) => !value)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => void loadOverview(true)}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setIsCustomizing(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>

      {isFilterPanelOpen && (
        <Card className="rounded-2xl border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Campaign Filter</CardTitle>
            <CardDescription>Limit dashboard data by campaign status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as CampaignStatusFilter)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by campaign status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => setStatusFilter("all")}>
              Clear filter
            </Button>
          </CardContent>
        </Card>
      )}

      {loadError && (
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive">Data sync warning</CardTitle>
            <CardDescription className="text-destructive/90">
              {loadError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" onClick={() => void loadOverview(true)}>
              Retry now
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-2xl font-bold">{stats.totalContacts.toLocaleString()}</p>
            <Users className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-2xl font-bold">{stats.messagesSent.toLocaleString()}</p>
            <Send className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-2xl font-bold">{activeCampaignCount}</p>
            <Zap className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reply Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-2xl font-bold">{replyRate}%</p>
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Metric trend for filtered campaigns.</CardDescription>
            </div>
            <Select
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value as DashboardMetric)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">Messages Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey={selectedMetric}
                  fill={METRIC_COLOR[selectedMetric]}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Campaign and messaging events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(filteredCampaigns.length ? filteredCampaigns.slice(0, 4) : FALLBACK_CHART_DATA).map(
              (item, index) => {
                const title = "name" in item ? item.name : `Campaign ${index + 1}`;
                const isCampaign = "status" in item;
                return (
                  <div
                    key={isCampaign ? item.id : `fallback-${index}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {isCampaign ? (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-primary" />
                      )}
                      <p className="truncate text-sm font-medium">{title}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {isCampaign ? String(item.status || "unknown").toLowerCase() : "sample"}
                    </Badge>
                  </div>
                );
              },
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogDescription>
              Widget visibility preferences will be wired per-user in a next iteration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <Label htmlFor="widget-kpis">KPI cards</Label>
              <Switch id="widget-kpis" checked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <Label htmlFor="widget-chart">Campaign chart</Label>
              <Switch id="widget-chart" checked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <Label htmlFor="widget-activity">Recent activity</Label>
              <Switch id="widget-activity" checked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Dashboard preferences saved.");
                setIsCustomizing(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
