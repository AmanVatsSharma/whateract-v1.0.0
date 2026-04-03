/**
 * File: src/app/(main)/audience/page.tsx
 * Module: audience-page
 * Purpose: Segment-aware audience directory with live backend filters.
 * Author: BharatERP
 * created: 2026-02-16
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAudienceContacts, fetchAudienceSegments } from "@/features/audience/services/audience.service";
import type { AudienceContactItem, AudienceSegmentItem } from "@/types/api-contracts";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString();
}

export default function AudiencePage() {
  const [contacts, setContacts] = useState<AudienceContactItem[]>([]);
  const [segments, setSegments] = useState<AudienceSegmentItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [segmentIdInput, setSegmentIdInput] = useState("ALL");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedSegmentId, setAppliedSegmentId] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSegments, setIsLoadingSegments] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSegments = useCallback(async () => {
    try {
      setIsLoadingSegments(true);
      const response = await fetchAudienceSegments();
      setSegments(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Audience segments load failed");
      setSegments([]);
    } finally {
      setIsLoadingSegments(false);
    }
  }, []);

  const loadAudience = useCallback(async () => {
    try {
      setErrorMessage("");
      setIsRefreshing(true);
      const response = await fetchAudienceContacts({
        search: appliedSearch || undefined,
        segmentId: appliedSegmentId === "ALL" ? undefined : appliedSegmentId,
      });
      setContacts(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Audience load failed");
      setContacts([]);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [appliedSearch, appliedSegmentId]);

  useEffect(() => {
    void loadAudience();
  }, [loadAudience]);

  useEffect(() => {
    void loadSegments();
  }, [loadSegments]);

  const selectedSegment = useMemo(
    () => segments.find((segment) => segment.id === appliedSegmentId) || null,
    [appliedSegmentId, segments],
  );

  const onApplyFilters = () => {
    setAppliedSearch(searchInput.trim());
    setAppliedSegmentId(segmentIdInput);
  };

  const onClearFilters = () => {
    setSearchInput("");
    setSegmentIdInput("ALL");
    setAppliedSearch("");
    setAppliedSegmentId("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Audience</h1>
          <p className="text-sm text-muted-foreground">
            Contact directory sourced from live backend audience API.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={isRefreshing}
          onClick={() => {
            void Promise.all([loadAudience(), loadSegments()]);
          }}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load audience</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Total Contacts" value={String(contacts.length)} />
        <MetricCard
          title="Contacts With Name"
          value={String(
            contacts.filter((contact) => contact.firstName || contact.lastName).length,
          )}
        />
        <MetricCard
          title="Contacts With Phone"
          value={String(contacts.filter((contact) => Boolean(contact.phone)).length)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audience Segments</CardTitle>
          <CardDescription>
            Segment counts are derived from backend contact and tag metadata.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingSegments ? (
              <p className="text-sm text-muted-foreground">Loading segment summaries...</p>
            ) : (
              segments.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  className={`rounded-md border p-3 text-left transition ${
                    segment.id === segmentIdInput ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                  }`}
                  onClick={() => setSegmentIdInput(segment.id)}
                >
                  <p className="text-sm font-medium">{segment.name}</p>
                  <p className="text-xs text-muted-foreground">{segment.description}</p>
                  <p className="mt-2 text-xl font-semibold">{segment.count}</p>
                </button>
              ))
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              Active segment: {selectedSegment?.name || "All Contacts"}
            </Badge>
            {appliedSearch ? <Badge variant="outline">Search: {appliedSearch}</Badge> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>
            Search and inspect contacts synchronized into your tenant by segment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, tag, or id"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <Select value={segmentIdInput} onValueChange={setSegmentIdInput}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Contacts</SelectItem>
                {segments
                  .filter((segment) => segment.id !== "ALL")
                  .map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onApplyFilters} disabled={isRefreshing}>
              Apply
            </Button>
            <Button variant="ghost" onClick={onClearFilters} disabled={isRefreshing}>
              Clear
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading audience...</p>
          ) : null}

          {!isLoading && contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No contacts match the applied audience filters.
            </p>
          ) : null}

          {!isLoading && contacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Contact ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => {
                  const name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
                  const tags = contact.tags || [];
                  return (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{name || "Unnamed contact"}</span>
                          {!name ? <Badge variant="outline">missing name</Badge> : null}
                        </div>
                      </TableCell>
                      <TableCell>{contact.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={contact.subscribed ? "default" : "secondary"}>
                          {contact.subscribed ? "subscribed" : "unsubscribed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tags.length ? (
                            tags.map((tag) => (
                              <Badge key={`${contact.id}-${tag}`} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell className="font-mono text-xs">{contact.id}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard(props: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{props.value}</p>
      </CardContent>
    </Card>
  );
}
