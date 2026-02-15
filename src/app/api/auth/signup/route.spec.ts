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
  REGISTER_AND_LOGIN_BFF_MUTATION:
    "mutation RegisterAndLoginBff($input: SignupInput!) { registerAndLogin(input: $input) { access_token } }",
}));

describe("auth/signup route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
    setAuthCookies.mockReset();
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "owner@example.com",
          password: "StrongPassword123!",
        }),
        headers: { "content-type": "application/json" },
      })
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("email, password and tenantName are required");
  });

  it("forwards otpCode and returns auth data envelope", async () => {
    proxyGraphql.mockResolvedValue({
      registerAndLogin: {
        access_token: "signup-token",
        tenant: { id: "tenant-1", name: "Acme" },
      },
    });

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: "owner@example.com",
        password: "StrongPassword123!",
        tenantName: "Acme",
        otpCode: "654321",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as { data: { access_token: string } };

    expect(response.status).toBe(200);
    expect(body.data.access_token).toBe("signup-token");
    expect(proxyGraphql).toHaveBeenCalledWith(
      request,
      expect.any(String),
      expect.objectContaining({
        input: expect.objectContaining({
          otpCode: "654321",
        }),
      })
    );
    expect(setAuthCookies).toHaveBeenCalledTimes(1);
  });
});
