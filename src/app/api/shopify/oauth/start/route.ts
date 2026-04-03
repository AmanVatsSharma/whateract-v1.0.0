/**
 * File: src/app/api/shopify/oauth/start/route.ts
 * Module: frontend-bff
 * Purpose: Start Shopify OAuth via backend and normalize redirect URI to frontend callback.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { NextResponse } from "next/server";
import { proxyToBackend } from "@/services/bff/backend-proxy";

type OauthStartPayload = {
  authUrl?: string;
  state?: string;
  shopDomain?: string;
};

function parseErrorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }
  return `Shopify OAuth start failed (${status})`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shopDomain = String(url.searchParams.get("shopDomain") || "").trim();
    if (!shopDomain) {
      return NextResponse.json({ error: "shopDomain is required" }, { status: 400 });
    }

    const backendResponse = await proxyToBackend(
      request,
      `/shopify/oauth/start?shopDomain=${encodeURIComponent(shopDomain)}`,
      { method: "GET" },
    );
    const backendPayload = (await backendResponse.json().catch(() => ({}))) as
      | OauthStartPayload
      | Record<string, unknown>;
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: parseErrorMessage(backendPayload, backendResponse.status) },
        { status: backendResponse.status },
      );
    }

    const payload = backendPayload as OauthStartPayload;
    if (!payload.authUrl) {
      return NextResponse.json(
        { error: "Backend returned empty Shopify authUrl" },
        { status: 502 },
      );
    }

    let authUrl = payload.authUrl;
    try {
      const auth = new URL(authUrl);
      auth.searchParams.set(
        "redirect_uri",
        `${url.origin.replace(/\/$/, "")}/api/shopify/oauth/callback`,
      );
      authUrl = auth.toString();
    } catch {
      // keep original auth url if parsing fails
    }

    return NextResponse.json({
      data: {
        authUrl,
        state: payload.state || "",
        shopDomain: payload.shopDomain || shopDomain,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start Shopify OAuth flow",
      },
      { status: 502 },
    );
  }
}
