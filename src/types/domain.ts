/**
 * File: src/types/domain.ts
 * Module: frontend-shared-types
 * Purpose: Shared domain-facing types for feature modules.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Keep UI-specific and API-specific types separated when possible.
 * - Extend this file as feature boundaries grow.
 */

export type InboxConversationStatus = "OPEN" | "PENDING" | "CLOSED";

export interface TeamMemberSummary {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  status: string;
}

