import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  TENANT_STATS_BFF_QUERY:
    "query TenantStats { tenantStats { totalContacts totalConversations messagesSent messagesInbound } }",
}));

describe("analytics/overview route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns tenant stats data", async () => {
    proxyGraphql.mockResolvedValue({
      tenantStats: {
        totalContacts: 122,
        totalConversations: 41,
        messagesSent: 1090,
        messagesInbound: 212,
      },
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/analytics/overview"));
    const body = (await response.json()) as {
      data: {
        totalContacts: number;
        totalConversations: number;
        messagesSent: number;
        messagesInbound: number;
      };
    };

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      totalContacts: 122,
      totalConversations: 41,
      messagesSent: 1090,
      messagesInbound: 212,
    });
  });

  it("returns 502 when analytics proxy fails", async () => {
    proxyGraphql.mockRejectedValue(new Error("analytics timeout"));

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/analytics/overview"));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(502);
    expect(body.error).toContain("analytics timeout");
  });
});
