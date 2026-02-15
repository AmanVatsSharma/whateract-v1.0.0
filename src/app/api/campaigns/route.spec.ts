import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  CAMPAIGNS_BFF_QUERY: "query Campaigns { campaigns { id name status type } }",
}));

describe("campaigns route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns campaign data from GraphQL proxy", async () => {
    proxyGraphql.mockResolvedValue({
      campaigns: [
        {
          id: "campaign-1",
          name: "Welcome drip",
          status: "ACTIVE",
          type: "BROADCAST",
        },
      ],
    });

    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/campaigns");
    const response = await GET(request);
    const body = (await response.json()) as {
      data: Array<{ id: string; name: string; status: string; type: string }>;
    };

    expect(proxyGraphql).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({
      id: "campaign-1",
      name: "Welcome drip",
      status: "ACTIVE",
      type: "BROADCAST",
    });
  });

  it("returns 502 response when proxy call fails", async () => {
    proxyGraphql.mockRejectedValue(new Error("GraphQL unavailable"));

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/campaigns"));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(502);
    expect(body.error).toContain("GraphQL unavailable");
  });
});
