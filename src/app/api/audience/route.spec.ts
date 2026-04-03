import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  CONTACTS_BFF_QUERY: "query Contacts { contacts { id phone } }",
}));

describe("audience route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("proxies audience contacts with search and segment filters", async () => {
    proxyGraphql.mockResolvedValue({
      contacts: [{ id: "contact-1", phone: "919999999999" }],
    });

    const { GET } = await import("./route");
    const request = new Request(
      "http://localhost/api/audience?search=vip&segmentId=TAG:premium",
    );
    const response = await GET(request);
    const body = (await response.json()) as { data: Array<{ id: string }> };

    expect(proxyGraphql).toHaveBeenCalledWith(
      request,
      expect.any(String),
      {
        search: "vip",
        segmentId: "TAG:premium",
      },
    );
    expect(response.status).toBe(200);
    expect(body.data[0]?.id).toBe("contact-1");
  });
});
