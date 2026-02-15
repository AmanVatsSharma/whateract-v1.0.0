"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Headset, LifeBuoy, Mail, MessageSquare } from "lucide-react";
import { createLogger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPage() {
  const logger = useMemo(() => createLogger("support-page"), []);
  const [requestType, setRequestType] = useState("general");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      toast.error("Please provide request details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: requestType,
          email: email.trim() || undefined,
          message: message.trim(),
          source: "support-page",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || `Support request failed (${response.status})`);
      }

      toast.success("Support request submitted.");
      setMessage("");
      setEmail("");
      setRequestType("general");
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Unable to submit support request.";
      logger.error("Support submission failed", messageText);
      toast.error(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help and Support</h1>
        <p className="text-muted-foreground">
          Get implementation help, report issues, and share product feedback.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Documentation</CardTitle>
            <CardDescription>Explore architecture and UI guides.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                docs/BFF-ARCHITECTURE.md
              </code>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                docs/COMPONENT-FLOW.md
              </code>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact channels</CardTitle>
            <CardDescription>Reach operations and engineering quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              support@whaterakt.app
            </p>
            <p className="flex items-center gap-2">
              <Headset className="h-4 w-4 text-primary" />
              SLA: within 1 business day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Priority incidents</CardTitle>
            <CardDescription>For delivery outages or auth failures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Mark request type as incident
            </p>
            <p className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Include requestId and tenant details
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a support request</CardTitle>
          <CardDescription>
            Provide context so the team can respond quickly and accurately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="support-type">Request type</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="support-type">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General support</SelectItem>
                    <SelectItem value="bug">Bug report</SelectItem>
                    <SelectItem value="feature">Feature request</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Contact email (optional)</Label>
                <Input
                  id="support-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@brand.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe the issue, expected behavior, and any error/requestId."
                className="min-h-[140px]"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
