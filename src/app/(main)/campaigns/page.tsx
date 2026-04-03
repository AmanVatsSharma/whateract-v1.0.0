/**
 * File: src/app/(main)/campaigns/page.tsx
 * Module: frontend-campaigns
 * Purpose: Campaign composition, targeting, and lifecycle operations screen.
 * Author: BharatERP
 * created: 2026-02-16
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, PencilLine, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import {
  createCampaign,
  duplicateCampaign,
  deleteCampaign,
  setCampaignStatus,
  updateCampaign,
} from "@/features/campaigns/services/campaigns.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { SectionLoader } from "@/components/shared/section-loader";
import { CampaignListItem } from "@/types/api-contracts";

type CampaignStatus = "DRAFT" | "SCHEDULED" | "PAUSED" | "SENT" | "FAILED";
type CampaignType = "BROADCAST" | "TRIGGERED" | "SEQUENCE";
type TemplateListItem = { id: string; name: string; status?: string };
type AudienceContact = {
  id: string;
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
};

const statusVariant: Record<CampaignStatus, "secondary" | "outline" | "destructive" | "default"> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  PAUSED: "secondary",
  SENT: "default",
  FAILED: "destructive",
};

function toDisplay(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

function toDateTimeInputValue(value?: string | null) {
  if (!value) {
    return "";
  }
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    return "";
  }
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${asDate.getFullYear()}-${pad(asDate.getMonth() + 1)}-${pad(asDate.getDate())}T${pad(asDate.getHours())}:${pad(asDate.getMinutes())}`;
}

function formatScheduledAt(value?: string | null) {
  if (!value) {
    return "-";
  }
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    return value;
  }
  return asDate.toLocaleString();
}

function contactLabel(contact: AudienceContact) {
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
  return fullName ? `${fullName} (${contact.phone})` : contact.phone;
}

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const { data: campaigns = [], isLoading, isFetching } = useCampaigns();
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [contacts, setContacts] = useState<AudienceContact[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("BROADCAST");
  const [scheduledAt, setScheduledAt] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [templateName, setTemplateName] = useState<string>("NONE");
  const [selectedAudienceContactIds, setSelectedAudienceContactIds] = useState<string[]>([]);
  const [audienceSearch, setAudienceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CampaignStatus>("ALL");
  const [isMutating, setIsMutating] = useState(false);

  const visibleContacts = useMemo(() => {
    const searchTerm = audienceSearch.trim().toLowerCase();
    if (!searchTerm) {
      return contacts;
    }
    return contacts.filter((item) =>
      `${item.phone} ${item.firstName || ""} ${item.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm),
    );
  }, [audienceSearch, contacts]);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "ALL") {
      return campaigns;
    }
    return campaigns.filter((item) => item.status === statusFilter);
  }, [campaigns, statusFilter]);

  const resetForm = () => {
    setEditingCampaignId(null);
    setName("");
    setType("BROADCAST");
    setScheduledAt("");
    setMessageBody("");
    setTemplateName("NONE");
    setSelectedAudienceContactIds([]);
    setAudienceSearch("");
  };

  const refreshCampaigns = async () => {
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  };

  const loadSupportingData = async () => {
    try {
      const [templatesResponse, contactsResponse] = await Promise.all([
        fetch("/api/templates", { cache: "no-store" }),
        fetch("/api/audience", { cache: "no-store" }),
      ]);

      if (templatesResponse.ok) {
        const templatePayload = (await templatesResponse.json()) as {
          data?: Array<{ id: string; name: string; status?: string }>;
        };
        setTemplates(templatePayload.data || []);
      }

      if (contactsResponse.ok) {
        const contactPayload = (await contactsResponse.json()) as {
          data?: Array<AudienceContact>;
        };
        setContacts(contactPayload.data || []);
      }
    } catch {
      toast.error("Unable to load templates or contacts for targeting");
    }
  };

  useEffect(() => {
    void loadSupportingData();
  }, []);

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditDialog = (campaign: CampaignListItem) => {
    setEditingCampaignId(campaign.id);
    setName(campaign.name || "");
    setType((campaign.type as CampaignType) || "BROADCAST");
    setScheduledAt(toDateTimeInputValue(campaign.scheduledAt));
    setMessageBody(campaign.messageBody || "");
    setTemplateName(campaign.templateName || "NONE");
    setSelectedAudienceContactIds(campaign.audienceContactIds || []);
    setAudienceSearch("");
    setIsCreateOpen(true);
  };

  const toggleAudience = (contactId: string) => {
    setSelectedAudienceContactIds((current) =>
      current.includes(contactId)
        ? current.filter((value) => value !== contactId)
        : [...current, contactId],
    );
  };

  const handleCreateOrUpdate = async () => {
    const normalizedName = name.trim();
    const normalizedTemplate = templateName === "NONE" ? null : templateName;
    const normalizedMessage = messageBody.trim();
    if (!normalizedName) {
      toast.error("Campaign name is required");
      return;
    }
    if (!normalizedTemplate && !normalizedMessage) {
      toast.error("Provide either message body or template");
      return;
    }

    try {
      setIsMutating(true);
      const payload = {
        name: normalizedName,
        type,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        messageBody: normalizedMessage || null,
        templateName: normalizedTemplate,
        audienceContactIds: selectedAudienceContactIds,
      };
      if (editingCampaignId) {
        await updateCampaign({
          campaignId: editingCampaignId,
          ...payload,
        });
        toast.success("Campaign updated");
      } else {
        await createCampaign(payload);
        toast.success("Campaign created");
      }
      setIsCreateOpen(false);
      resetForm();
      await refreshCampaigns();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save campaign");
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
        scheduledAt: status === "SCHEDULED" ? new Date().toISOString() : undefined,
      });
      await refreshCampaigns();
      toast.success(`Campaign moved to ${toDisplay(status)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDuplicate = async (campaign: CampaignListItem) => {
    try {
      setIsMutating(true);
      await duplicateCampaign({
        campaignId: campaign.id,
        newName: `${campaign.name} Copy`,
      });
      await refreshCampaigns();
      toast.success("Campaign duplicated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to duplicate campaign");
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
          <Button onClick={openCreateDialog}>
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
                  <SelectItem value="PAUSED">Paused</SelectItem>
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
                <TableHead>Template</TableHead>
                <TableHead>Audience</TableHead>
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
                  <TableCell>{campaign.templateName || "-"}</TableCell>
                  <TableCell>{campaign.audienceContactIds?.length || 0} contacts</TableCell>
                  <TableCell>{formatScheduledAt(campaign.scheduledAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "DRAFT")} disabled={isMutating}>Draft</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "SCHEDULED")} disabled={isMutating}>Schedule</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "PAUSED")} disabled={isMutating}>Pause</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "SENT")} disabled={isMutating}>Mark Sent</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(campaign.id, "FAILED")} disabled={isMutating}>Fail</Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(campaign)} disabled={isMutating}>
                        <PencilLine className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDuplicate(campaign)} disabled={isMutating}>
                        <Copy className="mr-1 h-3 w-3" />
                        Duplicate
                      </Button>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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
            <DialogTitle>{editingCampaignId ? "Edit campaign" : "Create campaign"}</DialogTitle>
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
              <Label>Template (optional)</Label>
              <Select value={templateName} onValueChange={setTemplateName}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional template selection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-message">Message body</Label>
              <Textarea
                id="campaign-message"
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder="Type campaign message (if no template selected)"
              />
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
            <div className="space-y-2">
              <Label htmlFor="audience-search">Targeted audience (optional)</Label>
              <Input
                id="audience-search"
                value={audienceSearch}
                onChange={(event) => setAudienceSearch(event.target.value)}
                placeholder="Search contacts by phone or name"
              />
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
                {!visibleContacts.length ? (
                  <p className="text-sm text-muted-foreground">No contacts available for targeting.</p>
                ) : (
                  visibleContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAudienceContactIds.includes(contact.id)}
                        onChange={() => toggleAudience(contact.id)}
                      />
                      <span className="text-sm">{contactLabel(contact)}</span>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected contacts: {selectedAudienceContactIds.length}. If left empty, campaign targets all subscribed contacts.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isMutating}
              onClick={handleCreateOrUpdate}
            >
              {editingCampaignId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
