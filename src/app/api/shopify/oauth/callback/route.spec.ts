import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyToBackend = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyToBackend,
}));

describe("shopify/oauth/callback route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyToBackend.mockReset();
  });

  it("redirects to success state when backend callback is ok", async () => {
    proxyToBackend.mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          shopDomain: "demo.myshopify.com",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    const { GET } = await import("./route");
    const response = await GET(
      new Request(
        "http://localhost:3001/api/shopify/oauth/callback?shop=demo.myshopify.com&code=abc&state=token&hmac=xyz",
      ),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/shopify?oauth=success");
  });
});
