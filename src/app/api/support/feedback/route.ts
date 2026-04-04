/**
 * File: src/app/api/support/feedback/route.ts
 * Module: frontend-bff
 * Purpose: Proxies support feedback to Nest /support/feedback.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-04-04
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

const feedbackSchema = z.object({
  type: z.enum(["general", "bug", "feature", "incident"]).default("general"),
  message: z.string().min(10, "message must have at least 10 characters"),
  email: z.string().email().optional(),
  source: z.string().min(1).max(120).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid feedback payload",
      },
      { status: 400 },
    );
  }

  return relayJsonDataResponse(request, "/support/feedback", {
    method: "POST",
    body: parsed.data,
  });
}
