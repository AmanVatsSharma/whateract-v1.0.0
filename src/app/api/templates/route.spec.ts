import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

describe("templates route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns template list for GET", async () => {
    proxyGraphql.mockResolvedValue({
      templates: [{ id: "tpl-1", name: "Welcome" }],
    });
    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/templates");
    const response = await GET(request);
    const body = (await response.json()) as { data: Array<{ id: string }> };
    expect(body.data[0].id).toBe("tpl-1");
  });

  it("creates template through POST mutation", async () => {
    proxyGraphql.mockResolvedValue({
      createTemplate: { id: "tpl-1", name: "Welcome" },
    });
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/templates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Welcome",
        content: "Hello {{1}}",
      }),
    });
    const response = await POST(request);
    const body = (await response.json()) as { data: { id: string } };
    expect(body.data.id).toBe("tpl-1");
  });

  it("updates template status through PATCH", async () => {
    proxyGraphql.mockResolvedValue({
      setTemplateStatus: { id: "tpl-1", status: "APPROVED" },
    });
    const { PATCH } = await import("./route");
    const request = new Request("http://localhost/api/templates", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        templateId: "tpl-1",
        status: "APPROVED",
      }),
    });
    const response = await PATCH(request);
    const body = (await response.json()) as { data: { status: string } };
    expect(body.data.status).toBe("APPROVED");
  });

  it("deletes template through DELETE mutation", async () => {
    proxyGraphql.mockResolvedValue({
      deleteTemplate: true,
    });
    const { DELETE } = await import("./route");
    const request = new Request("http://localhost/api/templates?templateId=tpl-1", {
      method: "DELETE",
    });
    const response = await DELETE(request);
    const body = (await response.json()) as { data: boolean };
    expect(body.data).toBe(true);
  });
});
