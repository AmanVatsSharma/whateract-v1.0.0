/**
 * File: src/app/(main)/automations/page.tsx
 * Module: frontend-automations
 * Purpose: Automation workflow builder with conditions, multi-step actions, and execution logs.
 * Author: BharatERP
 * created: 2026-02-16
 */

"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PencilLine, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAutomations } from "@/features/automations/hooks/use-automations";
import {
  createAutomation,
  deleteAutomation,
  updateAutomation,
  setAutomationEnabled,
} from "@/features/automations/services/automations.service";
import { useAutomationExecutionLogs } from "@/features/automations/hooks/use-automation-execution-logs";
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
import { Textarea } from "@/components/ui/textarea";
import { AutomationListItem } from "@/types/api-contracts";

type AutomationType = "KEYWORD_REPLY" | "DRIP_SEQUENCE" | "SHOPIFY_EVENT";
type ConditionOperator = "contains" | "equals" | "not_contains" | "starts_with";
type WorkflowStep = {
  id: string;
  offsetMinutes: number;
  message: string;
};

function createWorkflowStep(offsetMinutes = 0, message = ""): WorkflowStep {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    offsetMinutes,
    message,
  };
}

function parseDefinition(definitionJson?: string | null) {
  if (!definitionJson) {
    return {};
  }
  try {
    const parsed = JSON.parse(definitionJson);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function formatTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

export default function AutomationsPage() {
  const queryClient = useQueryClient();
  const { data: automations = [], isLoading, isFetching } = useAutomations();
  const [selectedLogAutomationId, setSelectedLogAutomationId] = useState<string>("ALL");
  const {
    data: executionLogs = [],
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
  } = useAutomationExecutionLogs(
    selectedLogAutomationId === "ALL" ? undefined : selectedLogAutomationId,
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAutomationId, setEditingAutomationId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [type, setType] = useState<AutomationType>("KEYWORD_REPLY");
  const [trigger, setTrigger] = useState("");
  const [recipient, setRecipient] = useState("");
  const [conditionField, setConditionField] = useState("text");
  const [conditionOperator, setConditionOperator] = useState<ConditionOperator>("contains");
  const [conditionValue, setConditionValue] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([createWorkflowStep(0, "")]);

  const logStatusVariant = (status: string) => {
    const normalized = status.toUpperCase();
    if (normalized === "FAILED") {
      return "destructive" as const;
    }
    if (normalized === "SKIPPED") {
      return "secondary" as const;
    }
    return "default" as const;
  };

  const resetForm = () => {
    setEditingAutomationId(null);
    setType("KEYWORD_REPLY");
    setTrigger("");
    setRecipient("");
    setConditionField("text");
    setConditionOperator("contains");
    setConditionValue("");
    setSteps([createWorkflowStep(0, "")]);
  };

  const refreshAutomations = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["automations"] }),
      queryClient.invalidateQueries({
        queryKey: [
          "automation-execution-logs",
          selectedLogAutomationId === "ALL" ? "all" : selectedLogAutomationId,
        ],
      }),
    ]);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditDialog = (automation: AutomationListItem) => {
    const definition = parseDefinition(automation.definitionJson);
    const definitionSteps = Array.isArray(definition.steps)
      ? definition.steps.map((step, index) => {
          if (typeof step === "string") {
            return createWorkflowStep(index * 60, step);
          }
          const node = (step || {}) as Record<string, unknown>;
          return createWorkflowStep(
            Number(node.offsetMinutes ?? node.delayMinutes ?? index * 60) || 0,
            String(node.message || node.text || node.body || ""),
          );
        })
      : [];
    const conditions = Array.isArray(definition.conditions)
      ? (definition.conditions as Array<Record<string, unknown>>)
      : [];
    const firstCondition = conditions[0] || {};
    setEditingAutomationId(automation.id);
    setType((automation.type as AutomationType) || "KEYWORD_REPLY");
    setTrigger(
      String(definition.trigger || definition.event || automation.trigger || ""),
    );
    setRecipient(String(definition.recipient || definition.to || ""));
    setConditionField(String(firstCondition.field || "text"));
    setConditionOperator(
      String(firstCondition.operator || "contains") as ConditionOperator,
    );
    setConditionValue(String(firstCondition.value || ""));
    setSteps(
      definitionSteps.length
        ? definitionSteps
        : [createWorkflowStep(0, String(definition.replyText || ""))],
    );
    setIsCreateOpen(true);
  };

  const updateStep = (stepId: string, patch: Partial<WorkflowStep>) => {
    setSteps((current) =>
      current.map((step) => (step.id === stepId ? { ...step, ...patch } : step)),
    );
  };

  const addStep = () => {
    setSteps((current) => [...current, createWorkflowStep(current.length * 60, "")]);
  };

  const removeStep = (stepId: string) => {
    setSteps((current) => {
      if (current.length <= 1) {
        return current;
      }
      return current.filter((step) => step.id !== stepId);
    });
  };

  const workflowPayload = useMemo(() => {
    const normalizedSteps = steps
      .map((step) => ({
        offsetMinutes: Number.isFinite(step.offsetMinutes)
          ? Math.max(0, Math.floor(step.offsetMinutes))
          : 0,
        message: step.message.trim(),
      }))
      .filter((step) => step.message.length > 0);
    const definition: Record<string, unknown> = {
      trigger: trigger.trim(),
      steps: normalizedSteps,
    };
    if (type === "DRIP_SEQUENCE") {
      definition.startAt = new Date().toISOString();
      if (recipient.trim()) {
        definition.recipient = recipient.trim();
      }
    }
    if (type === "KEYWORD_REPLY" && normalizedSteps[0]?.message) {
      definition.replyText = normalizedSteps[0].message;
    }
    if (type === "SHOPIFY_EVENT") {
      definition.event = trigger.trim().toUpperCase();
    }
    if (conditionValue.trim()) {
      definition.conditions = [
        {
          field: conditionField.trim() || "text",
          operator: conditionOperator,
          value: conditionValue.trim(),
        },
      ];
    }
    return {
      normalizedSteps,
      definition,
    };
  }, [conditionField, conditionOperator, conditionValue, recipient, steps, trigger, type]);

  const handleCreateOrUpdate = async () => {
    if (!trigger.trim()) {
      toast.error("Trigger is required");
      return;
    }
    if (!workflowPayload.normalizedSteps.length) {
      toast.error("Add at least one workflow step");
      return;
    }
    if (type === "DRIP_SEQUENCE" && !recipient.trim()) {
      toast.error("Recipient is required for drip sequence");
      return;
    }

    try {
      setIsMutating(true);
      const payload = {
        type,
        trigger: trigger.trim(),
        enabled: true,
        definition: workflowPayload.definition,
      };
      if (editingAutomationId) {
        await updateAutomation({
          automationId: editingAutomationId,
          ...payload,
        });
      } else {
        await createAutomation(payload);
      }
      setIsCreateOpen(false);
      resetForm();
      await refreshAutomations();
      toast.success(editingAutomationId ? "Automation updated" : "Automation created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save automation");
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
          <Button onClick={openCreateDialog}>
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
                <TableHead>Conditions</TableHead>
                <TableHead>Steps</TableHead>
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
                  <TableCell>{automation.conditionsCount || 0}</TableCell>
                  <TableCell>{automation.stepsCount || 0}</TableCell>
                  <TableCell>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? "active" : "paused"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTime(automation.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={automation.enabled}
                        onCheckedChange={(checked) => void handleToggle(automation.id, checked)}
                        disabled={isMutating}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(automation)}
                        disabled={isMutating}
                      >
                        <PencilLine className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No automations configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Execution Logs</CardTitle>
          <Select
            value={selectedLogAutomationId}
            onValueChange={setSelectedLogAutomationId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by automation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All automations</SelectItem>
              {automations.map((automation) => (
                <SelectItem key={automation.id} value={automation.id}>
                  {automation.type} - {automation.trigger || automation.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {(isLogsLoading || isLogsFetching) && (
            <SectionLoader label="Loading execution logs..." />
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executionLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTime(log.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={logStatusVariant(log.status)}>{log.status.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell>{log.triggerSource}</TableCell>
                  <TableCell>{log.recipient || "-"}</TableCell>
                  <TableCell className="max-w-[340px] truncate">{log.messagePreview || "-"}</TableCell>
                </TableRow>
              ))}
              {!executionLogs.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No execution logs found for the selected filter.
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
            <DialogTitle>{editingAutomationId ? "Edit automation" : "Create automation"}</DialogTitle>
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
                  <SelectItem value="SHOPIFY_EVENT">Shopify event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="automation-trigger">Trigger</Label>
              <Input
                id="automation-trigger"
                placeholder={type === "SHOPIFY_EVENT" ? "ORDER_CREATED" : "hello"}
                value={trigger}
                onChange={(event) => setTrigger(event.target.value)}
              />
            </div>
            {type === "DRIP_SEQUENCE" && (
              <div className="space-y-2">
                <Label htmlFor="automation-recipient">Recipient number</Label>
                <Input
                  id="automation-recipient"
                  placeholder="919999999999"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Condition field</Label>
                <Input
                  value={conditionField}
                  onChange={(event) => setConditionField(event.target.value)}
                  placeholder="text"
                />
              </div>
              <div className="space-y-2">
                <Label>Condition operator</Label>
                <Select
                  value={conditionOperator}
                  onValueChange={(value) => setConditionOperator(value as ConditionOperator)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">contains</SelectItem>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="not_contains">not_contains</SelectItem>
                    <SelectItem value="starts_with">starts_with</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition value</Label>
                <Input
                  value={conditionValue}
                  onChange={(event) => setConditionValue(event.target.value)}
                  placeholder="optional"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Workflow steps</Label>
              <div className="space-y-3 rounded-md border p-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="space-y-2 rounded border p-2">
                    <div className="grid grid-cols-[120px_1fr_auto] items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={String(step.offsetMinutes)}
                        onChange={(event) =>
                          updateStep(step.id, {
                            offsetMinutes: Number(event.target.value || "0"),
                          })
                        }
                        placeholder="Delay (mins)"
                      />
                      <Textarea
                        value={step.message}
                        onChange={(event) =>
                          updateStep(step.id, { message: event.target.value })
                        }
                        placeholder={`Step ${index + 1} message`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addStep}>
                  Add Step
                </Button>
              </div>
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
            <Button disabled={isMutating} onClick={handleCreateOrUpdate}>
              {editingAutomationId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
