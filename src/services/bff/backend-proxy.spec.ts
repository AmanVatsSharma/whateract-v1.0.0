import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { relayJsonDataResponse } from "./backend-proxy";

describe("relayJsonDataResponse", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.BACKEND_API_URL;
  });

  it("wraps successful backend JSON responses in data envelope", async () => {
    process.env.BACKEND_API_URL = "http://backend.local";
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ connected: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    ) as unknown as typeof fetch;

    const response = await relayJsonDataResponse(
      new Request("http://localhost/api/shopify/status"),
      "/shopify/status"
    );
    const body = (await response.json()) as { data: { connected: boolean } };

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { connected: true } });
  });

  it("returns normalized error envelope for non-2xx responses", async () => {
    process.env.BACKEND_API_URL = "http://backend.local";
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "invalid webhook signature" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    ) as unknown as typeof fetch;

    const response = await relayJsonDataResponse(
      new Request("http://localhost/api/settings/webhook"),
      "/integrations/webhook/validate",
      {
        method: "POST",
        body: { token: "bad" },
      }
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("invalid webhook signature");
  });
});
