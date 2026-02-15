import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();
const setAuthCookies = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/auth-cookies", () => ({
  setAuthCookies,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  LOGIN_BFF_MUTATION: "mutation LoginBff($input: LoginInput!) { login(input: $input) { access_token } }",
}));

describe("auth/login route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
    setAuthCookies.mockReset();
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "missing-password@example.com" }),
        headers: { "content-type": "application/json" },
      })
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("email and password are required");
  });

  it("returns data envelope and sets cookies on success", async () => {
    proxyGraphql.mockResolvedValue({
      login: {
        access_token: "token-123",
        tenant: { id: "tenant-1", name: "Acme" },
      },
    });

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "owner@example.com",
        password: "StrongPassword123!",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as {
      data: { access_token: string; tenant: { id: string } };
    };

    expect(response.status).toBe(200);
    expect(body.data.access_token).toBe("token-123");
    expect(setAuthCookies).toHaveBeenCalledTimes(1);
  });

  it("returns 502 error envelope when proxy fails", async () => {
    proxyGraphql.mockRejectedValue(new Error("Backend auth unavailable"));

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "owner@example.com",
          password: "StrongPassword123!",
        }),
        headers: { "content-type": "application/json" },
      })
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(502);
    expect(body.error).toContain("Backend auth unavailable");
  });
});
