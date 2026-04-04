/**
 * File: src/lib/feature-flags.ts
 * Module: frontend-config
 * Purpose: Mirrors backend FEATURE_* flags for UI and middleware (NEXT_PUBLIC_*).
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-04-04
 */

export function isInboxFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_INBOX_ENABLED !== "false";
}

export function isAutomationsFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_AUTOMATIONS_ENABLED !== "false";
}
