/**
 * File: src/app/(main)/settings/page.tsx
 * Module: frontend-settings
 * Purpose: Tenant settings page with persisted workspace/configuration controls.
 * Author: BharatERP
 * created: 2026-02-15
 */

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getWorkspaceSettings,
  rotateApiKey,
  saveWorkspaceSettings,
  validateWebhook,
  WorkspaceSettingsPayload,
} from "@/features/settings/services/settings.service";
import {
  assignManagedWhatsAppNumber,
  getWhatsAppOnboardingFunnel,
  getWhatsAppOnboardingStatus,
  listManagedWhatsAppNumbers,
  setManagedWhatsAppChannelStatus,
  submitWhatsAppOnboardingRequest,
  upsertManagedWhatsAppNumber,
} from "@/features/settings/services/whatsapp-onboarding.service";
import {
  ManagedWhatsAppNumberPayload,
  WhatsAppOnboardingFunnelPayload,
  WhatsAppOnboardingStatusPayload,
} from "@/types/api-contracts";

const defaultSettings: WorkspaceSettingsPayload = {
  timezone: "UTC",
  language: "en",
  dateFormat: "YYYY-MM-DD",
  currency: "USD",
  autoReply: false,
  analyticsEnabled: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettingsPayload>(defaultSettings);
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<WhatsAppOnboardingStatusPayload | null>(null);
  const [funnel, setFunnel] = useState<WhatsAppOnboardingFunnelPayload | null>(null);
  const [managedNumbers, setManagedNumbers] = useState<ManagedWhatsAppNumberPayload[]>([]);
  const [businessLegalName, setBusinessLegalName] = useState("");
  const [businessContactEmail, setBusinessContactEmail] = useState("");
  const [businessContactPhone, setBusinessContactPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [expectedDailyVolume, setExpectedDailyVolume] = useState("");
  const [tenantReviewNotes, setTenantReviewNotes] = useState("");
  const [operatorPhoneNumberId, setOperatorPhoneNumberId] = useState("");
  const [operatorDisplayPhoneNumber, setOperatorDisplayPhoneNumber] = useState("");
  const [operatorWabaId, setOperatorWabaId] = useState("");
  const [operatorAssignTenantId, setOperatorAssignTenantId] = useState("");
  const [operatorAssignPhoneNumberId, setOperatorAssignPhoneNumberId] = useState("");
  const [operatorAssignReason, setOperatorAssignReason] = useState("");
  const [operatorActivateNow, setOperatorActivateNow] = useState(true);
  const [operatorStatusTenantId, setOperatorStatusTenantId] = useState("");
  const [operatorStatus, setOperatorStatus] = useState("ACTIVE");
  const [operatorStatusReason, setOperatorStatusReason] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [incoming, status, numbers, onboardingFunnel] = await Promise.all([
          getWorkspaceSettings(),
          getWhatsAppOnboardingStatus().catch(() => null),
          listManagedWhatsAppNumbers().catch(() => []),
          getWhatsAppOnboardingFunnel().catch(() => null),
        ]);
        setSettings({
          ...defaultSettings,
          ...incoming,
        });
        setOnboardingStatus(status || null);
        setManagedNumbers(Array.isArray(numbers) ? numbers : []);
        setFunnel(onboardingFunnel || null);
        if (status) {
          setBusinessLegalName(status?.businessLegalName || "");
          setBusinessContactEmail(status?.contactEmail || "");
          setBusinessContactPhone(status?.contactPhone || "");
          setBusinessWebsite(status?.website || "");
          setExpectedDailyVolume(
            status?.expectedDailyVolume ? String(status.expectedDailyVolume) : "",
          );
          setTenantReviewNotes(status?.reviewNotes || "");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load settings");
      }
    };
    void load();
  }, []);

  const onSavePreferences = async () => {
    try {
      setIsSaving(true);
      const saved = await saveWorkspaceSettings(settings);
      setSettings((prev) => ({
        ...prev,
        ...saved,
      }));
      toast.success("Workspace settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const onRotateApiKey = async () => {
    try {
      setIsSaving(true);
      const nextKey = await rotateApiKey();
      setApiKey(nextKey);
      toast.success("API key rotated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to rotate API key");
    } finally {
      setIsSaving(false);
    }
  };

  const onValidateWebhook = async () => {
    try {
      setIsSaving(true);
      const result = await validateWebhook(webhookUrl, webhookSecret);
      if (result?.ok) {
        toast.success(result.message || "Webhook URL is valid");
      } else {
        toast.error(result?.message || "Webhook validation failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Webhook validation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const refreshOnboarding = async () => {
    const [status, numbers, onboardingFunnel] = await Promise.all([
      getWhatsAppOnboardingStatus().catch(() => null),
      listManagedWhatsAppNumbers().catch(() => []),
      getWhatsAppOnboardingFunnel().catch(() => null),
    ]);
    setOnboardingStatus(status || null);
    setManagedNumbers(Array.isArray(numbers) ? numbers : []);
    setFunnel(onboardingFunnel || null);
  };

  const onSubmitOnboardingRequest = async () => {
    try {
      setIsSaving(true);
      const nextStatus = await submitWhatsAppOnboardingRequest({
        businessLegalName,
        contactEmail: businessContactEmail,
        contactPhone: businessContactPhone,
        website: businessWebsite,
        expectedDailyVolume: expectedDailyVolume ? Number(expectedDailyVolume) : undefined,
        reviewNotes: tenantReviewNotes,
      });
      setOnboardingStatus(nextStatus || null);
      toast.success("WhatsApp onboarding request submitted");
      await refreshOnboarding();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Onboarding request failed");
    } finally {
      setIsSaving(false);
    }
  };

  const onUpsertManagedNumber = async () => {
    try {
      setIsSaving(true);
      await upsertManagedWhatsAppNumber({
        phoneNumberId: operatorPhoneNumberId,
        displayPhoneNumber: operatorDisplayPhoneNumber,
        wabaId: operatorWabaId || undefined,
      });
      toast.success("Managed number saved");
      setOperatorPhoneNumberId("");
      setOperatorDisplayPhoneNumber("");
      setOperatorWabaId("");
      await refreshOnboarding();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save managed number");
    } finally {
      setIsSaving(false);
    }
  };

  const onAssignManagedNumber = async () => {
    try {
      setIsSaving(true);
      await assignManagedWhatsAppNumber({
        tenantId: operatorAssignTenantId,
        phoneNumberId: operatorAssignPhoneNumberId,
        activateNow: operatorActivateNow,
        reason: operatorAssignReason || undefined,
      });
      toast.success("Managed number assigned");
      setOperatorAssignReason("");
      await refreshOnboarding();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign managed number");
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdateChannelStatus = async () => {
    try {
      setIsSaving(true);
      await setManagedWhatsAppChannelStatus({
        tenantId: operatorStatusTenantId,
        status: operatorStatus,
        reason: operatorStatusReason || undefined,
      });
      toast.success("Channel status updated");
      setOperatorStatusReason("");
      await refreshOnboarding();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update channel status");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Persist workspace preferences, API key rotation, and webhook validation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Workspace Preferences
          </CardTitle>
          <CardDescription>Saved for your tenant via backend settings contract.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={settings.timezone || "UTC"}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
            >
              <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={settings.language || "en"}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
            >
              <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date format</Label>
            <Select
              value={settings.dateFormat || "YYYY-MM-DD"}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, dateFormat: value }))}
            >
              <SelectTrigger><SelectValue placeholder="Select date format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={settings.currency || "USD"}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, currency: value }))}
            >
              <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="auto-reply">Auto reply</Label>
            <Switch
              id="auto-reply"
              checked={Boolean(settings.autoReply)}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoReply: checked }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="analytics">Advanced analytics</Label>
            <Switch
              id="analytics"
              checked={Boolean(settings.analyticsEnabled)}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, analyticsEnabled: checked }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={onSavePreferences} disabled={isSaving}>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Webhook Validation
          </CardTitle>
          <CardDescription>
            Validate callback endpoints before enabling event pushes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-company.com/webhooks/whaterakt"
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook secret</Label>
            <Input
              id="webhook-secret"
              type="password"
              value={webhookSecret}
              onChange={(event) => setWebhookSecret(event.target.value)}
            />
          </div>
          <Button variant="outline" onClick={onValidateWebhook} disabled={isSaving || !webhookUrl}>
            Validate Webhook
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            API Key Rotation
          </CardTitle>
          <CardDescription>Generate and persist a new tenant API key.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={onRotateApiKey} disabled={isSaving}>
            Rotate API Key
          </Button>
          <Input value={apiKey} readOnly placeholder="No key generated in this session" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Managed WhatsApp Onboarding</CardTitle>
          <CardDescription>
            Submit onboarding profile, track readiness blockers, and monitor activation state.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 text-sm">
            <div>Status: {onboardingStatus?.status || "NEW"}</div>
            <div>Assigned Number: {onboardingStatus?.phoneNumberE164 || "-"}</div>
            <div>Approved Templates: {onboardingStatus?.approvedTemplates ?? 0}</div>
          </div>
          <div className="space-y-2">
            <Label>Business legal name</Label>
            <Input
              value={businessLegalName}
              onChange={(event) => setBusinessLegalName(event.target.value)}
              placeholder="Your Pvt Ltd"
            />
          </div>
          <div className="space-y-2">
            <Label>Business contact email</Label>
            <Input
              type="email"
              value={businessContactEmail}
              onChange={(event) => setBusinessContactEmail(event.target.value)}
              placeholder="ops@brand.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Business contact phone</Label>
            <Input
              value={businessContactPhone}
              onChange={(event) => setBusinessContactPhone(event.target.value)}
              placeholder="+9199XXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={businessWebsite}
              onChange={(event) => setBusinessWebsite(event.target.value)}
              placeholder="https://yourbrand.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Expected daily volume</Label>
            <Input
              value={expectedDailyVolume}
              onChange={(event) => setExpectedDailyVolume(event.target.value)}
              placeholder="5000"
            />
          </div>
          <div className="space-y-2">
            <Label>Review notes</Label>
            <Textarea
              value={tenantReviewNotes}
              onChange={(event) => setTenantReviewNotes(event.target.value)}
              placeholder="Any onboarding context for operations"
            />
          </div>
          <div className="space-y-2 rounded-md border p-3">
            <Label>Readiness checklist</Label>
            {(onboardingStatus?.checklist || []).map((item) => (
              <div key={item.key} className="text-sm">
                {item.done ? "DONE" : "PENDING"} - {item.label}
                {!item.done && item.blocker ? ` (${item.blocker})` : ""}
              </div>
            ))}
          </div>
          <Button
            onClick={onSubmitOnboardingRequest}
            disabled={isSaving || !businessLegalName || !businessContactEmail}
          >
            Submit WhatsApp Onboarding
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Managed Number Operations</CardTitle>
          <CardDescription>
            Operator controls for inventory add, tenant assignment, and channel status updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Phone number id</Label>
              <Input
                value={operatorPhoneNumberId}
                onChange={(event) => setOperatorPhoneNumberId(event.target.value)}
                placeholder="Meta phone_number_id"
              />
            </div>
            <div className="space-y-2">
              <Label>Display phone number</Label>
              <Input
                value={operatorDisplayPhoneNumber}
                onChange={(event) => setOperatorDisplayPhoneNumber(event.target.value)}
                placeholder="+91XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>WABA id</Label>
              <Input
                value={operatorWabaId}
                onChange={(event) => setOperatorWabaId(event.target.value)}
                placeholder="waba id"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onUpsertManagedNumber}
            disabled={isSaving || !operatorPhoneNumberId || !operatorDisplayPhoneNumber}
          >
            Save Managed Number
          </Button>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Assign to tenant id</Label>
              <Input
                value={operatorAssignTenantId}
                onChange={(event) => setOperatorAssignTenantId(event.target.value)}
                placeholder="tenant uuid"
              />
            </div>
            <div className="space-y-2">
              <Label>Assign phone number id</Label>
              <Select
                value={operatorAssignPhoneNumberId}
                onValueChange={setOperatorAssignPhoneNumberId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select managed number" />
                </SelectTrigger>
                <SelectContent>
                  {managedNumbers.map((number) => (
                    <SelectItem key={number.phoneNumberId} value={number.phoneNumberId}>
                      {number.displayPhoneNumber} ({number.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Assignment reason</Label>
            <Input
              value={operatorAssignReason}
              onChange={(event) => setOperatorAssignReason(event.target.value)}
              placeholder="Initial tenant activation allocation"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="activateNow">Activate channel immediately</Label>
            <Switch
              id="activateNow"
              checked={operatorActivateNow}
              onCheckedChange={setOperatorActivateNow}
            />
          </div>
          <Button
            onClick={onAssignManagedNumber}
            disabled={isSaving || !operatorAssignTenantId || !operatorAssignPhoneNumberId}
          >
            Assign Managed Number
          </Button>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Channel tenant id</Label>
              <Input
                value={operatorStatusTenantId}
                onChange={(event) => setOperatorStatusTenantId(event.target.value)}
                placeholder="tenant uuid"
              />
            </div>
            <div className="space-y-2">
              <Label>Channel status</Label>
              <Select value={operatorStatus} onValueChange={setOperatorStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCS_PENDING">DOCS_PENDING</SelectItem>
                  <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                  <SelectItem value="NUMBER_ASSIGNED">NUMBER_ASSIGNED</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status reason</Label>
              <Input
                value={operatorStatusReason}
                onChange={(event) => setOperatorStatusReason(event.target.value)}
                placeholder="Operational review complete"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onUpdateChannelStatus}
            disabled={isSaving || !operatorStatusTenantId || !operatorStatus}
          >
            Update Channel Status
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Funnel Snapshot</CardTitle>
          <CardDescription>
            Live status bucket counts for operational readiness tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Total channels: {funnel?.total ?? 0}</div>
          {Object.entries(funnel?.byStatus || {}).map(([status, count]) => (
            <div key={status}>
              {status}: {count}
            </div>
          ))}
          <Button variant="outline" onClick={refreshOnboarding} disabled={isSaving}>
            Refresh onboarding data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
