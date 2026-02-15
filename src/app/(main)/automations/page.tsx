/**
 * File: src/app/(main)/automations/page.tsx
 * Module: frontend-automations
 * Purpose: Automation management page wired to backend create/update/delete flows.
 * Author: BharatERP
 * created: 2026-02-15
 */

"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAutomations } from "@/features/automations/hooks/use-automations";
import {
  createAutomation,
  deleteAutomation,
  setAutomationEnabled,
} from "@/features/automations/services/automations.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SectionLoader } from "@/components/shared/section-loader";

type AutomationType = "KEYWORD_REPLY" | "DRIP_SEQUENCE";

export default function AutomationsPage() {
  const queryClient = useQueryClient();
  const { data: automations = [], isLoading, isFetching } = useAutomations();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [type, setType] = useState<AutomationType>("KEYWORD_REPLY");
  const [trigger, setTrigger] = useState("");
  const [message, setMessage] = useState("");

  const refreshAutomations = async () => {
    await queryClient.invalidateQueries({ queryKey: ["automations"] });
  };

  const handleCreate = async () => {
    try {
      setIsMutating(true);
      await createAutomation({
        type,
        trigger: trigger.trim() || undefined,
        enabled: true,
        definition:
          type === "KEYWORD_REPLY"
            ? {
                trigger: trigger.trim(),
                replyText: message.trim(),
              }
            : {
                trigger: trigger.trim(),
                startAt: new Date().toISOString(),
                steps: [
                  {
                    offsetMinutes: 0,
                    message: message.trim(),
                  },
                ],
              },
      });
      setIsCreateOpen(false);
      setTrigger("");
      setMessage("");
      await refreshAutomations();
      toast.success("Automation created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create automation");
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggle = async (automationId: string, enabled: boolean) => {
    try {
      setIsMutating(true);
      await setAutomationEnabled(automationId, enabled);
      await refreshAutomations();
      toast.success(enabled ? "Automation enabled" : "Automation paused");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update automation");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (automationId: string) => {
    try {
      setIsMutating(true);
      await deleteAutomation(automationId);
      await refreshAutomations();
      toast.success("Automation deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete automation");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <SectionLoader label="Loading automations..." />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automations</h1>
          <p className="text-muted-foreground">
            Manage keyword replies and drip sequences from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshAutomations} disabled={isFetching || isMutating}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Automation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => (
                <TableRow key={automation.id}>
                  <TableCell>{automation.type}</TableCell>
                  <TableCell>{automation.trigger || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? "active" : "paused"}
                    </Badge>
                  </TableCell>
                  <TableCell>{automation.createdAt || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={automation.enabled}
                        onCheckedChange={(checked) => void handleToggle(automation.id, checked)}
                        disabled={isMutating}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void handleDelete(automation.id)}
                        disabled={isMutating}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!automations.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No automations configured yet.
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
            <DialogTitle>Create automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Automation type</Label>
              <Select value={type} onValueChange={(value) => setType(value as AutomationType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KEYWORD_REPLY">Keyword reply</SelectItem>
                  <SelectItem value="DRIP_SEQUENCE">Drip sequence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="automation-trigger">Trigger</Label>
              <Input
                id="automation-trigger"
                placeholder="hello"
                value={trigger}
                onChange={(event) => setTrigger(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="automation-message">Message</Label>
              <Input
                id="automation-message"
                placeholder="Namaste! How can we help?"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!trigger.trim() || !message.trim() || isMutating} onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
