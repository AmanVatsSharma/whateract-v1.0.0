import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyToBackend = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyToBackend,
}));

describe("shopify/oauth/start route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyToBackend.mockReset();
  });

  it("returns authUrl envelope with frontend callback redirect", async () => {
    proxyToBackend.mockResolvedValue(
      new Response(
        JSON.stringify({
          authUrl:
            "https://demo.myshopify.com/admin/oauth/authorize?client_id=a&scope=read_orders&redirect_uri=http://localhost:3000/shopify/oauth/callback&state=token",
          state: "token",
          shopDomain: "demo.myshopify.com",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    const { GET } = await import("./route");
    const request = new Request(
      "http://localhost:3001/api/shopify/oauth/start?shopDomain=demo.myshopify.com",
    );
    const response = await GET(request);
    const body = (await response.json()) as {
      data: { authUrl: string; shopDomain: string };
    };

    expect(proxyToBackend).toHaveBeenCalledTimes(1);
    expect(body.data.shopDomain).toBe("demo.myshopify.com");
    expect(body.data.authUrl).toContain(
      encodeURIComponent("http://localhost:3001/api/shopify/oauth/callback"),
    );
  });
});
