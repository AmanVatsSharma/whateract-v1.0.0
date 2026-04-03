"use client";
/**
 * File: src/app/(main)/message-templates/page.tsx
 * Module: message-templates
 * Purpose: Production template lifecycle UI backed by live template APIs.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type TemplateItem = {
  id: string;
  name: string;
  content: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string | null;
};

type TemplateFormState = {
  name: string;
  content: string;
  category: TemplateItem["category"];
  status: TemplateItem["status"];
};

const EMPTY_FORM: TemplateFormState = {
  name: "",
  content: "",
  category: "MARKETING",
  status: "PENDING",
};

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateFormState>(EMPTY_FORM);

  const sortedTemplates = useMemo(
    () => [...templates].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [templates],
  );

  const loadTemplates = useCallback(async () => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const response = await fetch("/api/templates", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load templates");
      }
      setTemplates(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load templates";
      setErrorMessage(message);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingTemplateId(null);
  };

  const onSaveTemplate = async () => {
    const name = form.name.trim();
    const content = form.content.trim();
    if (!name || !content) {
      toast.error("Template name and content are required");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      const method = editingTemplateId ? "PATCH" : "POST";
      const body = editingTemplateId
        ? {
            templateId: editingTemplateId,
            name,
            content,
            category: form.category,
            status: form.status,
          }
        : {
            name,
            content,
            category: form.category,
            status: form.status,
          };
      const response = await fetch("/api/templates", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Template save failed");
      }
      toast.success(editingTemplateId ? "Template updated" : "Template created");
      resetForm();
      await loadTemplates();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Template save failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteTemplate = async (templateId: string) => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      const response = await fetch(`/api/templates?templateId=${encodeURIComponent(templateId)}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to delete template");
      }
      toast.success("Template deleted");
      if (editingTemplateId === templateId) {
        resetForm();
      }
      await loadTemplates();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete template";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onTemplateStatusChange = async (
    templateId: string,
    nextStatus: TemplateItem["status"],
  ) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/templates", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId, status: nextStatus }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update status");
      }
      toast.success("Template status updated");
      await loadTemplates();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update status";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Message Templates</h1>
        <p className="text-muted-foreground">
          Manage live WhatsApp templates without mock or fallback data.
        </p>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Template operation failed</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{editingTemplateId ? "Edit template" : "Create template"}</CardTitle>
          <CardDescription>
            Template content is stored server-side and reflected in campaign send flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Order shipped update"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, category: value as TemplateItem["category"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKETING">MARKETING</SelectItem>
                  <SelectItem value="UTILITY">UTILITY</SelectItem>
                  <SelectItem value="AUTHENTICATION">AUTHENTICATION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              rows={5}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Hi {{1}}, your order {{2}} is now in transit."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value as TemplateItem["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={onSaveTemplate} disabled={isSaving}>
                {editingTemplateId ? "Update Template" : "Create Template"}
              </Button>
              {editingTemplateId ? (
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={resetForm}
                >
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template library</CardTitle>
          <CardDescription>All templates are fetched from live backend storage.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-sm text-muted-foreground">Loading templates...</p> : null}
          {!isLoading && sortedTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No templates found. Create your first template to get started.
            </p>
          ) : null}
          {!isLoading && sortedTemplates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={template.status}
                        onValueChange={(value) =>
                          onTemplateStatusChange(
                            template.id,
                            value as TemplateItem["status"],
                          )
                        }
                        disabled={isSaving}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="APPROVED">APPROVED</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{template.createdAt?.slice(0, 10) || "-"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => {
                          setEditingTemplateId(template.id);
                          setForm({
                            name: template.name,
                            content: template.content,
                            category: template.category,
                            status: template.status,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => onDeleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
