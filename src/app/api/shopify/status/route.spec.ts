import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonDataResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonDataResponse,
}));

describe("shopify/status route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonDataResponse.mockReset();
  });

  it("relays request to backend status endpoint", async () => {
    const mockedResponse = new Response(
      JSON.stringify({ data: { connected: true } }),
      {
      status: 200,
      headers: { "content-type": "application/json" },
      }
    );
    relayJsonDataResponse.mockResolvedValue(mockedResponse);

    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/shopify/status");
    const response = await GET(request);
    const body = (await response.json()) as { data: { connected: boolean } };

    expect(relayJsonDataResponse).toHaveBeenCalledTimes(1);
    expect(relayJsonDataResponse).toHaveBeenCalledWith(request, "/shopify/status");
    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { connected: true } });
  });
});
