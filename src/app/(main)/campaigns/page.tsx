/**
 * File: src/app/(main)/campaigns/page.tsx
 * Module: frontend-campaigns
 * Purpose: Campaign management screen wired to BFF CRUD/status routes.
 * Author: BharatERP
 * created: 2026-02-15
 */

"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import {
  createCampaign,
  deleteCampaign,
  setCampaignStatus,
} from "@/features/campaigns/services/campaigns.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionLoader } from "@/components/shared/section-loader";

type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENT" | "FAILED";
type CampaignType = "BROADCAST" | "TRIGGERED" | "SEQUENCE";

const statusVariant: Record<CampaignStatus, "secondary" | "outline" | "destructive" | "default"> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  SENT: "default",
  FAILED: "destructive",
};

function toDisplay(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const { data: campaigns = [], isLoading, isFetching } = useCampaigns();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("BROADCAST");
  const [scheduledAt, setScheduledAt] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CampaignStatus>("ALL");
  const [isMutating, setIsMutating] = useState(false);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "ALL") {
      return campaigns;
    }
    return campaigns.filter((item) => item.status === statusFilter);
  }, [campaigns, statusFilter]);

  const refreshCampaigns = async () => {
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  };

  const handleCreate = async () => {
    try {
      setIsMutating(true);
      await createCampaign({
        name: name.trim(),
        type,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      });
      setName("");
      setScheduledAt("");
      setIsCreateOpen(false);
      await refreshCampaigns();
      toast.success("Campaign created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create campaign");
    } finally {
      setIsMutating(false);
    }
  };

  const handleStatus = async (campaignId: string, status: CampaignStatus) => {
    try {
      setIsMutating(true);
      await setCampaignStatus({
        campaignId,
        status,
        scheduledAt: status === "SCHEDULED" ? new Date().toISOString() : null,
      });
      await refreshCampaigns();
      toast.success(`Campaign moved to ${toDisplay(status)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      setIsMutating(true);
      await deleteCampaign(campaignId);
      await refreshCampaigns();
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete campaign");
    } finally {
      setIsMutating(false);
    }
  };

  const sentCount = campaigns.filter((item) => item.status === "SENT").length;
  const scheduledCount = campaigns.filter((item) => item.status === "SCHEDULED").length;

  return (
    <div className="space-y-6">
      {isLoading && <SectionLoader label="Loading campaigns..." />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage outbound WhatsApp campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshCampaigns} disabled={isFetching || isMutating}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{campaigns.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{scheduledCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sent</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{sentCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campaign List</CardTitle>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[campaign.status as CampaignStatus] || "secondary"}>
                      {toDisplay(campaign.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.scheduledAt || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "DRAFT")} disabled={isMutating}>Draft</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "SCHEDULED")} disabled={isMutating}>Schedule</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "SENT")} disabled={isMutating}>Mark Sent</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "FAILED")} disabled={isMutating}>Fail</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(campaign.id)} disabled={isMutating}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filteredCampaigns.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No campaigns found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign name</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Festival offer blast"
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign type</Label>
              <Select value={type} onValueChange={(value) => setType(value as CampaignType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BROADCAST">Broadcast</SelectItem>
                  <SelectItem value="TRIGGERED">Triggered</SelectItem>
                  <SelectItem value="SEQUENCE">Sequence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-at">Scheduled at (optional)</Label>
              <Input
                id="scheduled-at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!name.trim() || isMutating} onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
