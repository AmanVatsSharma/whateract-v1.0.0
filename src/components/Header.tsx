"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bell,
  Command as CommandIcon,
  HelpCircle,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  Zap,
} from "lucide-react";
import type { CampaignsResponse } from "@/types/api-contracts";
import { createLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { initialsFromEmail, readBrowserCookie } from "@/lib/workspace-display";
import { CompactThemeSelector } from "@/components/ThemeSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type HeaderNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  unread: boolean;
  type: "campaign" | "shopify" | "system";
  createdAt: number;
};

type ShopifyStatus = {
  connected?: boolean;
  shopDomain?: string | null;
  lastOrdersSyncAt?: string | null;
};

type Envelope<T> = {
  data?: T;
  error?: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const logger = useMemo(() => createLogger("app-header"), []);
  const [mounted, setMounted] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState("");
  const [userEmailDisplay, setUserEmailDisplay] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);

  useEffect(() => {
    setWorkspaceLabel(readBrowserCookie("tenant_label"));
    setUserEmailDisplay(readBrowserCookie("user_email"));
  }, [pathname]);

  const headerWorkspace = workspaceLabel.trim() || "Workspace";
  const headerEmail = userEmailDisplay.trim() || "";
  const headerInitials = headerEmail ? initialsFromEmail(headerEmail) : "WA";

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  const loadNotifications = useCallback(async () => {
    try {
      const [campaignsRes, shopifyRes] = await Promise.all([
        fetch("/api/campaigns", { cache: "no-store" }),
        fetch("/api/shopify/status", { cache: "no-store" }),
      ]);

      const nextNotifications: HeaderNotification[] = [];
      const now = Date.now();
      const campaignsPayload = (await campaignsRes
        .json()
        .catch(() => ({ data: [] }))) as CampaignsResponse;
      const shopifyEnvelope = (await shopifyRes
        .json()
        .catch(() => ({ data: {} }))) as Envelope<ShopifyStatus>;
      const shopifyPayload = shopifyEnvelope.data || {};

      const campaignList = Array.isArray(campaignsPayload.data)
        ? campaignsPayload.data
        : [];
      const activeCount = campaignList.filter(
        (campaign) => String(campaign.status || "").toLowerCase() === "active",
      ).length;

      if (activeCount > 0) {
        nextNotifications.push({
          id: "campaign-active",
          title: "Active campaigns in progress",
          description: `${activeCount} campaigns are currently running.`,
          href: "/campaigns",
          unread: true,
          type: "campaign",
          createdAt: now - 1000 * 60 * 3,
        });
      }

      if (campaignList.length > 0) {
        const latestCampaign = campaignList[0];
        nextNotifications.push({
          id: `campaign-${latestCampaign.id}`,
          title: "Campaign feed updated",
          description: `${latestCampaign.name} status is ${latestCampaign.status?.toLowerCase() || "updated"}.`,
          href: "/campaigns",
          unread: true,
          type: "campaign",
          createdAt: now - 1000 * 60 * 10,
        });
      }

      if (shopifyPayload.connected) {
        nextNotifications.push({
          id: "shopify-connected",
          title: "Shopify connected",
          description: `Store ${shopifyPayload.shopDomain || "connected"} is healthy.`,
          href: "/shopify",
          unread: false,
          type: "shopify",
          createdAt: now - 1000 * 60 * 20,
        });
      } else {
        nextNotifications.push({
          id: "shopify-disconnected",
          title: "Shopify connection required",
          description: "Connect your Shopify store to unlock sync automation.",
          href: "/shopify",
          unread: true,
          type: "shopify",
          createdAt: now - 1000 * 60 * 30,
        });
      }

      if (nextNotifications.length === 0) {
        nextNotifications.push({
          id: "system-welcome",
          title: "Workspace ready",
          description: "Start by creating your first campaign.",
          href: "/campaigns",
          unread: true,
          type: "system",
          createdAt: now - 1000 * 60 * 5,
        });
      }

      setNotifications(
        nextNotifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown notification loading error";
      logger.warn("Failed to load header notifications", message);
      setNotifications([
        {
          id: "system-fallback",
          title: "Notifications temporarily unavailable",
          description: "Open Notifications page for detailed troubleshooting.",
          href: "/notifications",
          unread: true,
          type: "system",
          createdAt: Date.now(),
        },
      ]);
    }
  }, [logger]);

  useEffect(() => {
    setMounted(true);
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const markNotificationRead = (id: string, href: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    );
    router.push(href);
  };

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) {
      toast.error("Please provide feedback details.");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const response = await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: feedbackType,
          message: feedbackMessage.trim(),
          source: "header-dialog",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || `Feedback submission failed (${response.status})`);
      }

      toast.success("Feedback submitted successfully.");
      setFeedbackMessage("");
      setFeedbackType("general");
      setIsFeedbackOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit feedback right now.";
      logger.error("Feedback submission failed", message);
      toast.error(message);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      toast.success("Logged out.");
    } catch {
      toast.error("Logout failed.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 border-b border-transparent transition-all",
          isScrolled && "border-border/60 bg-background/90 backdrop-blur",
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">Whaterakt</p>
              <p className="text-xs text-muted-foreground">Marketing Console</p>
            </div>
          </Link>

          <form
            className="hidden max-w-xl flex-1 lg:block"
            onSubmit={(event) => {
              event.preventDefault();
              setIsSearchOpen(true);
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, audience, analytics..."
                className="pl-10 pr-16"
                onFocus={() => setIsSearchOpen(true)}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Ctrl+K
              </kbd>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Open search</span>
            </Button>

            <Button size="sm" onClick={() => router.push("/campaigns?new=1")}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Campaign</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-96 p-0">
                <div className="flex items-center justify-between border-b p-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Button variant="ghost" size="sm" onClick={markAllRead}>
                    Mark all read
                  </Button>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={cn(
                        "block w-full border-b p-3 text-left transition-colors hover:bg-muted/40",
                        notification.unread && "bg-primary/5",
                      )}
                      onClick={() =>
                        markNotificationRead(notification.id, notification.href)
                      }
                    >
                      <p className="text-sm font-semibold">{notification.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="border-t p-3">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => router.push("/notifications")}
                  >
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback>{headerInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="space-y-1">
                  <p className="text-sm font-semibold">{headerWorkspace}</p>
                  <p className="text-xs text-muted-foreground">
                    {headerEmail || "Signed in"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help and feedback
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(event) => event.preventDefault()}>
                  <div className="w-full py-2">
                    <p className="mb-2 text-xs text-muted-foreground">Theme</p>
                    <CompactThemeSelector />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No matching destination found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => router.push("/campaigns")}>
              <CommandIcon className="mr-2 h-4 w-4" />
              Open campaigns
            </CommandItem>
            <CommandItem onSelect={() => router.push("/audience")}>
              <CommandIcon className="mr-2 h-4 w-4" />
              Open audience
            </CommandItem>
            <CommandItem onSelect={() => router.push("/analytics")}>
              <CommandIcon className="mr-2 h-4 w-4" />
              Open analytics
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Workspace settings
            </CommandItem>
            <CommandItem onSelect={() => router.push("/shopify")}>
              <Settings className="mr-2 h-4 w-4" />
              Shopify integration
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Help and feedback</DialogTitle>
            <DialogDescription>
              Share blockers, bugs, or ideas. Your submission is routed to support intake.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug report</SelectItem>
                  <SelectItem value="feature">Feature request</SelectItem>
                  <SelectItem value="general">General feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                value={feedbackMessage}
                onChange={(event) => setFeedbackMessage(event.target.value)}
                placeholder="Explain what happened, what you expected, and any relevant context."
                className="min-h-[130px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFeedbackSubmit} disabled={isSubmittingFeedback}>
              {isSubmittingFeedback ? "Submitting..." : "Submit feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
