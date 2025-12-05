/**
 * ============================================
 * INBOX PAGE - Modern Light Theme
 * ============================================
 * 
 * Professional messaging interface featuring:
 * - Clean light design aesthetic
 * - Real-time conversations
 * - AI-powered features
 * - Label management
 * - Team collaboration
 * - Responsive layout
 * - Modern messaging UI
 * 
 * @page
 * @version 2.0.0
 */

"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { createLogger } from "@/lib/logger";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paperclip, Send, Sparkles, Star, Filter, Search, Clock, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const logger = createLogger("inbox");

console.log('💬 Inbox: Page loaded with modern light theme');

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  priority: "low" | "high";
  tags: string[];
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [labelsByConv, setLabelsByConv] = useState<Record<string, string[]>>({});
  const [assigneeByConv, setAssigneeByConv] = useState<Record<string, string>>({});
  const [notesByConv, setNotesByConv] = useState<Record<string, string>>({});
  const [statusByConv, setStatusByConv] = useState<Record<string, "open" | "snoozed" | "closed">>({});

  // Available options (UI-only). Replace with backend data when wired.
  const availableAgents = ["You", "Aisha", "Rahul", "Priya"];
  const availableLabels = ["VIP", "Return", "New", "Support", "Lead"];

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get("/conversations");
        // In mock mode, apiClient points to /api but we intercept via mocks in demo flows.
        const list = (res.data?.data || []) as Conversation[];
        setConversations(list);
        if (list.length && !selected) setSelected(list[0]);
      } catch (e) {
        logger.error("load conversations failed", e);
      }
    }
    load();
  }, [selected]);

  const filtered = useMemo(() => {
    return conversations.filter((c) =>
      `${c.name} ${c.lastMessage}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [conversations, query]);

  const sendMessage = async () => {
    if (!message.trim() || !selected) return;
    logger.info("send", { to: selected.id, message });
    setMessage("");
  };

  const suggestAiReply = async () => {
    try {
      const res = await apiClient.post("/ai/reply", {
        text: message || selected?.lastMessage || "",
        conversationId: selected?.id,
      });
      const suggestion: string = res.data?.suggestion || "";
      if (suggestion) {
        setMessage(suggestion);
        toast.success("AI suggestion ready");
      } else {
        toast.info("No suggestion available");
      }
    } catch (e) {
      logger.error("ai suggest failed", e);
      toast.error("AI suggestion failed");
    }
  };

  const summarizeThread = async () => {
    if (!selected) return;
    try {
      setIsSummarizing(true);
      const res = await apiClient.post("/ai/summarize", {
        conversationId: selected.id,
      });
      const s: string = res.data?.summary || "";
      setSummary(s);
      if (s) toast.success("Summary generated");
    } catch (e) {
      logger.error("summarize failed", e);
      toast.error("Summarization failed");
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleLabel = (convId: string, label: string) => {
    setLabelsByConv((prev) => {
      const cur = new Set(prev[convId] || []);
      if (cur.has(label)) cur.delete(label); else cur.add(label);
      return { ...prev, [convId]: Array.from(cur) };
    });
  };

  const setAssignee = (convId: string, assignee: string) => {
    setAssigneeByConv((prev) => ({ ...prev, [convId]: assignee }));
    toast.success(`Assigned to ${assignee}`);
  };

  const setStatus = (convId: string, status: "open" | "snoozed" | "closed") => {
    setStatusByConv((prev) => ({ ...prev, [convId]: status }));
    toast.message(`Thread ${status}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 sm:p-6 animate-fadeIn">
      {/* Conversations list */}
      <Card className="col-span-12 lg:col-span-3 overflow-hidden rounded-2xl border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            <span>Inbox</span>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-[120px] rounded-xl"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="pl-8 rounded-xl" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-240px)]">
            {filtered.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setSelected(c)}
                className={cn(
                  "flex w-full items-center gap-3 p-3 text-left rounded-xl transition-all",
                  "hover:bg-primary/5 hover:border-l-4 hover:border-primary",
                  selected?.id === c.id ? "bg-primary/10 border-l-4 border-primary shadow-sm" : ""
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Avatar>
                  <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{c.name}</div>
                    {c.unread > 0 && (
                      <Badge variant="secondary">{c.unread}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{c.lastMessage}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                {c.priority === "high" && <Star className="h-4 w-4 text-yellow-500" />}
              </motion.button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Thread */}
      <Card className="col-span-12 lg:col-span-6 overflow-hidden rounded-2xl border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{selected?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{selected?.name || "Select a conversation"}</div>
                <div className="text-xs text-muted-foreground">{statusByConv[selected?.id || ""] || "open"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-xl hover:bg-primary/5"><Filter className="mr-2 h-4 w-4" />Label</Button>
                  </TooltipTrigger>
                  <TooltipContent>Assign labels</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" variant="outline" onClick={summarizeThread} disabled={!selected || isSummarizing} className="rounded-xl hover:bg-primary/5 bg-gradient-to-r from-purple-50 to-transparent">
                <Sparkles className="mr-2 h-4 w-4 text-purple-600" />{isSummarizing ? "Summarizing..." : "AI Summarize"}
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-xl hover:bg-primary/5"><Clock className="mr-2 h-4 w-4" />Snooze</Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <Button variant="ghost" onClick={() => selected && setStatus(selected.id, "snoozed")} className="w-full justify-start">For 1 hour</Button>
                    <Button variant="ghost" onClick={() => selected && setStatus(selected.id, "snoozed")} className="w-full justify-start">Until tomorrow</Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button size="sm" variant="destructive" onClick={() => selected && setStatus(selected.id, "closed")} className="rounded-xl"><X className="mr-2 h-4 w-4" />Close</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-340px)] p-4">
            {/* Message thread placeholder */}
            <div className="space-y-4">
              <div className="max-w-[70%] rounded-2xl bg-muted/50 border p-4 shadow-sm">
                Hi! Can you share your catalog?
              </div>
              <div className="ml-auto max-w-[70%] rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground shadow-lg">
                Absolutely, sharing now!
              </div>
            </div>
          </ScrollArea>
          <div className="border-t p-3 bg-gradient-to-t from-muted/20 to-transparent">
            <div className="flex items-end gap-2">
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message..." className="min-h-[60px] rounded-xl" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={suggestAiReply} className="rounded-xl bg-gradient-to-r from-purple-50 to-transparent hover:bg-purple-100">
                      <Sparkles className="mr-2 h-4 w-4 text-purple-600" />AI Reply
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Suggest a reply</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button onClick={sendMessage} className="rounded-xl bg-gradient-to-r from-primary to-primary/80 font-semibold"><Send className="mr-2 h-4 w-4" />Send</Button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Paperclip className="h-4 w-4" /> Attachments supported (media, docs)
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile / Assignment / Labels / Notes */}
      <Card className="col-span-12 lg:col-span-3 overflow-hidden rounded-2xl border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-xl font-bold">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Assignee</div>
            <Select onValueChange={(v) => selected && setAssignee(selected.id, v)} value={selected ? assigneeByConv[selected.id] || "" : undefined}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                {availableAgents.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Labels</div>
            <div className="space-y-2">
              {availableLabels.map((l) => {
                const checked = selected ? (labelsByConv[selected.id] || []).includes(l) : false;
                return (
                  <label key={l} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checked} onCheckedChange={() => selected && toggleLabel(selected.id, l)} />
                    {l}
                  </label>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1">
              {(selected ? labelsByConv[selected.id] || [] : []).map((t) => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Internal Notes</div>
            <Textarea
              value={selected ? (notesByConv[selected.id] || "") : ""}
              onChange={(e) => selected && setNotesByConv((p) => ({ ...p, [selected.id]: e.target.value }))}
              placeholder="Add notes for your team..."
              className="min-h-[120px] rounded-xl"
            />
            <Button variant="outline" size="sm" className="rounded-xl hover:bg-primary/5">Save Note</Button>
          </div>

          {summary && (
            <div className="space-y-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                AI Summary
              </div>
              <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-transparent p-4 text-sm whitespace-pre-wrap text-foreground shadow-sm">
                {summary}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
