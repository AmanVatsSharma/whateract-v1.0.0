import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonDataResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonDataResponse,
}));

describe("shopify/sync/orders route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonDataResponse.mockReset();
  });

  it("uses envelope relay helper for order sync", async () => {
    const mockedResponse = new Response(
      JSON.stringify({ data: { ok: true, count: 15 } }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
    relayJsonDataResponse.mockResolvedValue(mockedResponse);

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/shopify/sync/orders", {
      method: "POST",
      body: JSON.stringify({ limit: 50 }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as { data: { ok: boolean; count: number } };

    expect(relayJsonDataResponse).toHaveBeenCalledWith(
      request,
      "/shopify/sync/orders",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({ limit: 50 }),
      })
    );
    expect(response.status).toBe(200);
    expect(body.data).toEqual({ ok: true, count: 15 });
  });
});
