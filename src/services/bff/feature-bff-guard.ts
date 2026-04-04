/**
 * @file feature-bff-guard.ts
 * @module services/bff
 * @description Returns 503 from BFF when inbox/automations features are off or when server `FEATURE_*` mirrors disagree with `NEXT_PUBLIC_*`.
 * @author Whaterakt
 * @created 2026-04-04
 */

import { NextResponse } from "next/server";
import {
  isAutomationsFeatureEnabled,
  isInboxFeatureEnabled,
} from "@/lib/feature-flags";

function envIsEnabled(raw: string | undefined): boolean {
  return raw !== "false";
}

/**
 * If `FEATURE_INBOX_ENABLED` is set on the Next server, it must match the public flag.
 * When the UI flag is off, inbox BFF routes are closed even if something calls them directly.
 */
export function inboxFeatureBffGuard(): NextResponse | null {
  const publicOn = isInboxFeatureEnabled();
  const mirror = process.env.FEATURE_INBOX_ENABLED;
  if (mirror !== undefined && envIsEnabled(mirror) !== publicOn) {
    return NextResponse.json(
      {
        error: "feature_flag_mismatch",
        message:
          "FEATURE_INBOX_ENABLED must match NEXT_PUBLIC_FEATURE_INBOX_ENABLED for the BFF.",
      },
      { status: 503 },
    );
  }
  if (!publicOn) {
    return NextResponse.json(
      {
        error: "inbox_disabled",
        message: "Inbox feature is disabled for this deployment.",
      },
      { status: 503 },
    );
  }
  return null;
}

/** Same semantics as {@link inboxFeatureBffGuard} for automations. */
export function automationsFeatureBffGuard(): NextResponse | null {
  const publicOn = isAutomationsFeatureEnabled();
  const mirror = process.env.FEATURE_AUTOMATIONS_ENABLED;
  if (mirror !== undefined && envIsEnabled(mirror) !== publicOn) {
    return NextResponse.json(
      {
        error: "feature_flag_mismatch",
        message:
          "FEATURE_AUTOMATIONS_ENABLED must match NEXT_PUBLIC_FEATURE_AUTOMATIONS_ENABLED for the BFF.",
      },
      { status: 503 },
    );
  }
  if (!publicOn) {
    return NextResponse.json(
      {
        error: "automations_disabled",
        message: "Automations feature is disabled for this deployment.",
      },
      { status: 503 },
    );
  }
  return null;
}
