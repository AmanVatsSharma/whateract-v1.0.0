import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  AUTOMATIONS_BFF_QUERY: "query Automations { automations { id type enabled trigger } }",
  CREATE_AUTOMATION_BFF_MUTATION: "mutation CreateAutomation { createAutomation { id } }",
  UPDATE_AUTOMATION_BFF_MUTATION: "mutation UpdateAutomation { updateAutomation { id } }",
  DELETE_AUTOMATION_BFF_MUTATION: "mutation DeleteAutomation { deleteAutomation }",
}));

describe("automations route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns list payload on GET", async () => {
    proxyGraphql.mockResolvedValue({
      automations: [{ id: "auto-1", type: "KEYWORD_REPLY", enabled: true }],
    });
    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/automations"));
    const body = (await response.json()) as { data: Array<{ id: string }> };
    expect(response.status).toBe(200);
    expect(body.data[0]?.id).toBe("auto-1");
  });

  it("validates required type on POST", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/automations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(response.status).toBe(400);
  });
});
