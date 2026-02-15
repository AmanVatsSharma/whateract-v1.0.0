import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonDataResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonDataResponse,
}));

describe("shopify/connect route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonDataResponse.mockReset();
  });

  it("relays payload through contract envelope helper", async () => {
    const mockedResponse = new Response(
      JSON.stringify({ data: { connected: true } }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
    relayJsonDataResponse.mockResolvedValue(mockedResponse);

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/shopify/connect", {
      method: "POST",
      body: JSON.stringify({ shopDomain: "acme.myshopify.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as { data: { connected: boolean } };

    expect(relayJsonDataResponse).toHaveBeenCalledTimes(1);
    expect(relayJsonDataResponse).toHaveBeenCalledWith(
      request,
      "/shopify/connect",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({ shopDomain: "acme.myshopify.com" }),
      })
    );
    expect(response.status).toBe(200);
    expect(body.data.connected).toBe(true);
  });
});
