import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  AUDIENCE_SEGMENTS_BFF_QUERY:
    "query AudienceSegments { audienceSegments { id name count } }",
}));

describe("audience segments route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns audience segment summaries", async () => {
    proxyGraphql.mockResolvedValue({
      audienceSegments: [{ id: "ALL", name: "All Contacts", count: 3 }],
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/audience/segments"));
    const body = (await response.json()) as { data: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(body.data[0]?.id).toBe("ALL");
  });
});
