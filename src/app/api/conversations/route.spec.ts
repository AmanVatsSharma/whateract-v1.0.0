import { beforeEach, describe, expect, it, vi } from "vitest";

const relayJsonResponse = vi.fn();
const relayJsonDataResponse = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  relayJsonResponse,
  relayJsonDataResponse,
}));

describe("conversations route", () => {
  beforeEach(() => {
    vi.resetModules();
    relayJsonResponse.mockReset();
    relayJsonDataResponse.mockReset();
  });

  it("proxies list conversations through relayJsonResponse", async () => {
    relayJsonResponse.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/conversations");
    const response = await GET(request);
    expect(relayJsonResponse).toHaveBeenCalledWith(request, "/inbox/conversations");
    expect(response.status).toBe(200);
  });

  it("forwards filters on GET list route", async () => {
    relayJsonResponse.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { GET } = await import("./route");
    const request = new Request(
      "http://localhost/api/conversations?search=vip&status=OPEN&assignedUserId=UNASSIGNED&tag=priority",
    );
    const response = await GET(request);
    expect(relayJsonResponse).toHaveBeenCalledWith(
      request,
      "/inbox/conversations?search=vip&status=OPEN&assignedUserId=UNASSIGNED&tag=priority",
    );
    expect(response.status).toBe(200);
  });

  it("routes PATCH assign action to assignment endpoint", async () => {
    relayJsonDataResponse.mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { PATCH } = await import("./route");
    const request = new Request("http://localhost/api/conversations", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        conversationId: "conversation-1",
        action: "assign",
        userId: "agent-1",
      }),
    });
    const response = await PATCH(request);
    expect(relayJsonDataResponse).toHaveBeenCalledWith(
      request,
      "/inbox/conversations/conversation-1/assignment",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
    expect(response.status).toBe(200);
  });

  it("routes DELETE untag action to tag endpoint", async () => {
    relayJsonDataResponse.mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { DELETE } = await import("./route");
    const request = new Request("http://localhost/api/conversations", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        conversationId: "conversation-1",
        action: "untag",
        tag: "vip customer",
      }),
    });
    const response = await DELETE(request);
    expect(relayJsonDataResponse).toHaveBeenCalledWith(
      request,
      "/inbox/conversations/conversation-1/tags/vip%20customer",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
    expect(response.status).toBe(200);
  });
});
