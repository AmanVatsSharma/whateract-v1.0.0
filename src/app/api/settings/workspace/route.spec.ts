import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonResponse,
}));

describe("settings/workspace route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonResponse.mockReset();
  });

  it("proxies GET workspace settings", async () => {
    relayJsonResponse.mockResolvedValue(
      new Response(JSON.stringify({ timezone: "UTC" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/settings/workspace");
    const response = await GET(request);
    expect(relayJsonResponse).toHaveBeenCalledWith(
      request,
      "/integrations/workspace-settings",
    );
    expect(response.status).toBe(200);
  });
});
