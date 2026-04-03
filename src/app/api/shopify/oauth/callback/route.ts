/**
 * File: src/app/api/shopify/oauth/callback/route.ts
 * Module: frontend-bff
 * Purpose: Complete Shopify OAuth callback and redirect user to Shopify UI.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { NextResponse } from "next/server";
import { proxyToBackend } from "@/services/bff/backend-proxy";

type OauthCallbackPayload = {
  ok?: boolean;
  shopDomain?: string;
};

function buildUiRedirect(requestUrl: URL, params: Record<string, string>) {
  const target = new URL("/shopify", requestUrl.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      target.searchParams.set(key, value);
    }
  });
  return target;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.toString();
  if (!query) {
    return NextResponse.redirect(
      buildUiRedirect(requestUrl, {
        oauth: "failed",
        reason: "missing_query_params",
      }),
    );
  }

  try {
    const backendResponse = await proxyToBackend(
      request,
      `/shopify/oauth/callback?${query}`,
      { method: "GET" },
    );
    const payload = (await backendResponse.json().catch(() => ({}))) as
      | OauthCallbackPayload
      | Record<string, unknown>;
    if (!backendResponse.ok || !(payload as OauthCallbackPayload).ok) {
      const reason =
        payload && typeof payload === "object" && "message" in payload
          ? String((payload as Record<string, unknown>).message || "callback_failed")
          : "callback_failed";
      return NextResponse.redirect(
        buildUiRedirect(requestUrl, {
          oauth: "failed",
          reason,
        }),
      );
    }

    return NextResponse.redirect(
      buildUiRedirect(requestUrl, {
        oauth: "success",
        shopDomain: String((payload as OauthCallbackPayload).shopDomain || ""),
      }),
    );
  } catch (error) {
    return NextResponse.redirect(
      buildUiRedirect(requestUrl, {
        oauth: "failed",
        reason:
          error instanceof Error
            ? error.message.slice(0, 120)
            : "callback_request_failed",
      }),
    );
  }
}
