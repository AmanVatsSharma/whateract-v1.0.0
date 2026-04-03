import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  AUTOMATION_EXECUTION_LOGS_BFF_QUERY:
    "query AutomationExecutionLogs { automationExecutionLogs { id status } }",
}));

describe("automation logs route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns execution logs payload", async () => {
    proxyGraphql.mockResolvedValue({
      automationExecutionLogs: [
        {
          id: "log-1",
          status: "QUEUED",
        },
      ],
    });

    const { GET } = await import("./route");
    const response = await GET(
      new Request("http://localhost/api/automations/logs"),
    );
    const body = (await response.json()) as { data: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(body.data[0]?.id).toBe("log-1");
  });
});
