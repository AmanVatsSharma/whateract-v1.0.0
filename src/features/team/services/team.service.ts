/**
 * File: src/features/team/services/team.service.ts
 * Module: frontend-team
 * Purpose: Team onboarding service APIs for frontend usage.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Maps to backend `/team-onboarding/*` endpoints.
 * - Keeps page components free from direct endpoint strings.
 */

import { apiClient } from "@/lib/api-client";

export async function createTeam(payload: { name: string; description?: string }) {
  const response = await apiClient.post("/team-onboarding/team", payload);
  return response.data;
}

export async function inviteTeamMember(payload: {
  teamId: string;
  email: string;
  role?: "OWNER" | "ADMIN" | "MARKETER" | "AGENT" | "VIEWER";
}) {
  const response = await apiClient.post("/team-onboarding/invites", payload);
  return response.data;
}

export async function acceptTeamInvite(payload: { token: string; userId: string }) {
  const response = await apiClient.post("/team-onboarding/invites/accept", payload);
  return response.data;
}

export async function listTeamMembers(teamId?: string) {
  const response = await apiClient.get("/team-onboarding/members", {
    params: teamId ? { teamId } : undefined,
  });
  return response.data;
}

