/**
 * File: src/services/bff/backend-proxy.ts
 * Module: frontend-bff
 * Purpose: Shared backend proxy and GraphQL helper for Next API routes.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Forwards tenant/auth/request correlation headers.
 * - Read proxyToBackend and proxyGraphql first.
 */

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export interface GraphqlEnvelope<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function getBackendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:3000"
  );
}

function readCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const targetCookie = cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith(`${name}=`));
  if (!targetCookie) {
    return null;
  }
  return decodeURIComponent(targetCookie.split("=")[1] || "");
}

function buildForwardHeaders(request: Request, hasBody = false): HeadersInit {
  const headers: Record<string, string> = {};
  const authHeader = request.headers.get("authorization");
  const tenantId = request.headers.get("x-tenant-id");
  const requestId = request.headers.get("x-request-id") || randomUUID();

  if (authHeader) {
    headers.authorization = authHeader;
  } else {
    const token = readCookieValue(request, "access_token");
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
  }

  if (tenantId || readCookieValue(request, "tenant_id")) {
    headers["x-tenant-id"] = tenantId || String(readCookieValue(request, "tenant_id"));
  }
  if (requestId) {
    headers["x-request-id"] = requestId;
  }
  if (hasBody) {
    headers["content-type"] = "application/json";
  }

  return headers;
}

export async function proxyToBackend(
  request: Request,
  backendPath: string,
  init: { method?: string; body?: unknown } = {}
): Promise<Response> {
  const baseUrl = getBackendBaseUrl().replace(/\/$/, "");
  const path = backendPath.startsWith("/") ? backendPath : `/${backendPath}`;
  const hasBody = init.body !== undefined;
  const timeoutMs = Number(process.env.BFF_BACKEND_TIMEOUT_MS || 15_000);
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${baseUrl}${path}`, {
      method: init.method || "GET",
      headers: buildForwardHeaders(request, hasBody),
      body: hasBody ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown backend proxy error";
    throw new Error(`Backend request failed for ${path}: ${message}`);
  } finally {
    clearTimeout(timeoutHandle);
  }
}

export async function proxyGraphql<T>(
  request: Request,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await proxyToBackend(request, "/graphql", {
    method: "POST",
    body: { query, variables },
  });

  const envelope = (await response.json()) as GraphqlEnvelope<T>;
  if (!response.ok || envelope.errors?.length) {
    const errorMessage =
      envelope.errors?.[0]?.message ||
      `Backend GraphQL call failed (${response.status})`;
    throw new Error(errorMessage);
  }

  if (!envelope.data) {
    throw new Error("Backend GraphQL returned empty data");
  }
  return envelope.data;
}

export async function relayJsonResponse(
  request: Request,
  backendPath: string,
  init: { method?: string; body?: unknown } = {}
): Promise<NextResponse> {
  try {
    const response = await proxyToBackend(request, backendPath, init);
    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backend proxy request failed";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 502 }
    );
  }
}

function parseBackendErrorMessage(payload: JsonValue | null, status: number) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }
  return `Backend request failed (${status})`;
}

async function parseBackendJsonPayload(response: Response): Promise<JsonValue | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

export async function relayJsonDataResponse(
  request: Request,
  backendPath: string,
  init: { method?: string; body?: unknown } = {}
): Promise<NextResponse> {
  try {
    const response = await proxyToBackend(request, backendPath, init);
    const payload = await parseBackendJsonPayload(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: parseBackendErrorMessage(payload, response.status),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        data: payload,
      },
      { status: response.status }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backend proxy request failed";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 502 }
    );
  }
}
