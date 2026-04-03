/**
 * File: src/app/(main)/inbox/page.tsx
 * Module: inbox-page
 * Purpose: Live inbox workspace with filtering, assignment UX, and tag lifecycle actions.
 * Author: BharatERP
 * created: 2026-02-16
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  addConversationNote,
  AssignableMember,
  assignConversation,
  fetchAssignableMembers,
  fetchConversationThread,
  fetchConversations,
  getConversationLabel,
  sendConversationMessage,
  setConversationStatus,
  tagConversation,
  untagConversation,
} from "@/features/inbox/services/inbox.service";
import type { ConversationListItem, ConversationThreadPayload } from "@/types/api-contracts";

type ConversationStatus = "OPEN" | "PENDING" | "CLOSED";
type ConversationStatusFilter = "ALL" | ConversationStatus;

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [assignableMembers, setAssignableMembers] = useState<AssignableMember[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [thread, setThread] = useState<ConversationThreadPayload | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatusFilter>("ALL");
  const [assignedFilter, setAssignedFilter] = useState("ALL");
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{
    search?: string;
    status?: ConversationStatus;
    assignedUserId?: string;
    tag?: string;
  }>({});
  const [composeMessage, setComposeMessage] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [assignUserId, setAssignUserId] = useState("");

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const assignableMemberByUserId = useMemo(() => {
    const map = new Map<string, AssignableMember>();
    for (const member of assignableMembers) {
      map.set(member.userId, member);
    }
    return map;
  }, [assignableMembers]);

  const loadConversations = useCallback(async () => {
    try {
      setErrorMessage("");
      setIsLoadingList(true);
      const list = await fetchConversations(appliedFilters);
      setConversations(list);
      if (!selectedConversationId && list.length) {
        setSelectedConversationId(list[0].id);
      } else if (selectedConversationId && !list.some((item) => item.id === selectedConversationId)) {
        setSelectedConversationId(list[0]?.id || "");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load conversations";
      setErrorMessage(message);
      setConversations([]);
    } finally {
      setIsLoadingList(false);
    }
  }, [appliedFilters, selectedConversationId]);

  const loadThread = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      setThread(null);
      return;
    }
    try {
      setErrorMessage("");
      setIsLoadingThread(true);
      const response = await fetchConversationThread(conversationId);
      setThread(response);
      setAssignUserId(response?.assignedUserId || "UNASSIGNED");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load conversation thread";
      setErrorMessage(message);
      setThread(null);
    } finally {
      setIsLoadingThread(false);
    }
  }, []);

  const loadAssignableTeamMembers = useCallback(async () => {
    try {
      setIsLoadingMembers(true);
      const members = await fetchAssignableMembers();
      setAssignableMembers(members);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load assignable team members";
      setErrorMessage(message);
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    void loadAssignableTeamMembers();
  }, [loadAssignableTeamMembers]);

  useEffect(() => {
    if (!selectedConversationId) {
      setThread(null);
      return;
    }
    void loadThread(selectedConversationId);
  }, [loadThread, selectedConversationId]);

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      setIsSaving(true);
      await action();
      toast.success(successMessage);
      await Promise.all([
        loadConversations(),
        loadThread(selectedConversationId),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Inbox action failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onSendMessage = async () => {
    const message = composeMessage.trim();
    if (!selectedConversationId || !message) {
      toast.error("Select a conversation and enter a message");
      return;
    }
    await runAction(
      async () => {
        await sendConversationMessage({
          conversationId: selectedConversationId,
          message,
        });
        setComposeMessage("");
      },
      "Message sent",
    );
  };

  const onAddNote = async () => {
    const content = noteInput.trim();
    if (!selectedConversationId || !content) {
      toast.error("Add note text before saving");
      return;
    }
    await runAction(
      async () => {
        await addConversationNote({
          conversationId: selectedConversationId,
          content,
        });
        setNoteInput("");
      },
      "Conversation note added",
    );
  };

  const onTagConversation = async () => {
    const tag = tagInput.trim();
    if (!selectedConversationId || !tag) {
      toast.error("Provide a tag value");
      return;
    }
    await runAction(
      async () => {
        await tagConversation({
          conversationId: selectedConversationId,
          tag,
        });
        setTagInput("");
      },
      "Tag added",
    );
  };

  const onRemoveTag = async (tag: string) => {
    if (!selectedConversationId || !tag) {
      return;
    }
    await runAction(
      async () => {
        await untagConversation({
          conversationId: selectedConversationId,
          tag,
        });
      },
      "Tag removed",
    );
  };

  const onAssignConversation = async () => {
    const selectedAssignee = assignUserId.trim();
    if (!selectedConversationId || !selectedAssignee) {
      toast.error("Select an assignee option");
      return;
    }
    await runAction(
      async () => {
        await assignConversation({
          conversationId: selectedConversationId,
          userId: selectedAssignee === "UNASSIGNED" ? null : selectedAssignee,
        });
      },
      selectedAssignee === "UNASSIGNED"
        ? "Conversation unassigned"
        : "Conversation assigned",
    );
  };

  const onApplyFilters = () => {
    setAppliedFilters({
      search: searchInput.trim() || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      assignedUserId: assignedFilter === "ALL" ? undefined : assignedFilter,
      tag: tagFilterInput.trim() || undefined,
    });
  };

  const onClearFilters = () => {
    setSearchInput("");
    setStatusFilter("ALL");
    setAssignedFilter("ALL");
    setTagFilterInput("");
    setAppliedFilters({});
  };

  const onStatusChange = async (status: ConversationStatus) => {
    if (!selectedConversationId) {
      return;
    }
    await runAction(
      async () => {
        await setConversationStatus({
          conversationId: selectedConversationId,
          status,
        });
      },
      "Conversation status updated",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Real-time thread operations backed by inbox conversation APIs.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={isLoadingList || isLoadingThread || isLoadingMembers || isSaving}
          onClick={() => {
            void Promise.all([
              loadConversations(),
              loadThread(selectedConversationId),
              loadAssignableTeamMembers(),
            ]);
          }}
        >
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Inbox sync warning</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Tenant-scoped list with search and filters.</CardDescription>
            <div className="space-y-2 pt-2">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by phone, name, or tag"
              />
              <div className="grid grid-cols-2 gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ConversationStatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All status</SelectItem>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All assignees</SelectItem>
                    <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                    {assignableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.userId}>
                        {member.userEmail || member.userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagFilterInput}
                  onChange={(event) => setTagFilterInput(event.target.value)}
                  placeholder="Filter by tag"
                />
                <Button size="sm" variant="outline" onClick={onApplyFilters}>
                  Apply
                </Button>
                <Button size="sm" variant="ghost" onClick={onClearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(70vh-100px)] p-0">
            <ScrollArea className="h-full">
              {isLoadingList ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">Loading conversations...</p>
              ) : null}
              {!isLoadingList && conversations.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  No conversations found.
                </p>
              ) : null}
              {!isLoadingList &&
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`w-full border-b px-4 py-3 text-left transition hover:bg-muted/60 ${
                      conversation.id === selectedConversationId ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversationId(conversation.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{getConversationLabel(conversation)}</p>
                      <Badge variant="outline">{conversation.status}</Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {conversation.lastMessage || "No recent message"}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground">
                      Assignee:{" "}
                      {conversation.assignedUserEmail ||
                        assignableMemberByUserId.get(conversation.assignedUserId || "")?.userEmail ||
                        "Unassigned"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatDateTime(conversation.lastMessageAt)}
                    </p>
                  </button>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle>Conversation Thread</CardTitle>
            <CardDescription>
              {selectedConversationId
                ? `Conversation ${selectedConversationId}`
                : "Select a conversation from the left panel"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-[calc(70vh-100px)] flex-col gap-4">
            {isLoadingThread ? (
              <p className="text-sm text-muted-foreground">Loading thread...</p>
            ) : null}

            {!isLoadingThread && !thread ? (
              <p className="text-sm text-muted-foreground">
                No thread loaded yet. Select a conversation to continue.
              </p>
            ) : null}

            {thread ? (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={(thread.status || selectedConversation?.status || "OPEN") as ConversationStatus}
                      onValueChange={(value) => {
                        void onStatusChange(value as ConversationStatus);
                      }}
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">OPEN</SelectItem>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="CLOSED">CLOSED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      value={assignUserId}
                      onValueChange={setAssignUserId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                        {assignableMembers.map((member) => (
                          <SelectItem key={member.id} value={member.userId}>
                            {member.userEmail || member.userId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={isSaving || isLoadingMembers || !assignUserId}
                      onClick={() => {
                        void onAssignConversation();
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Contact: {thread.contactPhone || "-"}</Badge>
                  {thread.tags?.map((tag) => (
                    <div key={tag} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          void onRemoveTag(tag);
                        }}
                        disabled={isSaving}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid flex-1 gap-3 lg:grid-cols-[1fr_300px]">
                  <ScrollArea className="h-[320px] rounded-md border p-3">
                    <div className="space-y-3">
                      {thread.messages?.length ? (
                        thread.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                              message.direction === "OUTBOUND"
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="mt-1 text-[11px] opacity-70">
                              {formatDateTime(message.createdAt)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No messages available for this conversation.
                        </p>
                      )}
                    </div>
                  </ScrollArea>

                  <ScrollArea className="h-[320px] rounded-md border p-3">
                    <h3 className="mb-2 text-sm font-medium">Notes</h3>
                    <div className="space-y-2">
                      {thread.notes?.length ? (
                        thread.notes.map((note) => (
                          <div key={note.id} className="rounded-md bg-muted p-2 text-xs">
                            <p>{note.content}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              by {note.userId} at {formatDateTime(note.createdAt)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No notes yet.</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Send message</Label>
                    <Textarea
                      rows={3}
                      value={composeMessage}
                      onChange={(event) => setComposeMessage(event.target.value)}
                      placeholder="Write a WhatsApp reply..."
                    />
                    <Button
                      disabled={isSaving}
                      onClick={() => {
                        void onSendMessage();
                      }}
                    >
                      Send Message
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Add note</Label>
                    <Textarea
                      rows={2}
                      value={noteInput}
                      onChange={(event) => setNoteInput(event.target.value)}
                      placeholder="Internal note for operators"
                    />
                    <Button
                      variant="outline"
                      disabled={isSaving}
                      onClick={() => {
                        void onAddNote();
                      }}
                    >
                      Save Note
                    </Button>
                    <div className="space-y-2">
                      <Label>Add tag</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(event) => setTagInput(event.target.value)}
                          placeholder="vip-customer"
                        />
                        <Button
                          variant="secondary"
                          disabled={isSaving}
                          onClick={() => {
                            void onTagConversation();
                          }}
                        >
                          Add Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
