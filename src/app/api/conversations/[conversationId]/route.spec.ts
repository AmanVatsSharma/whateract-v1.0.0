import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonResponse,
}));

describe("conversation thread route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonResponse.mockReset();
  });

  it("proxies GET thread endpoint with conversation id", async () => {
    relayJsonResponse.mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "conv-1", messages: [] } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/conversations/conv-1");
    const response = await GET(request, {
      params: Promise.resolve({ conversationId: "conv-1" }),
    });
    expect(relayJsonResponse).toHaveBeenCalledWith(
      request,
      "/inbox/conversations/conv-1/thread",
    );
    expect(response.status).toBe(200);
  });
});
