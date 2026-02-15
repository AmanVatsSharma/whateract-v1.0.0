import { beforeEach, describe, expect, it, vi } from "vitest";

const clearAuthCookies = vi.fn();

vi.mock("@/services/bff/auth-cookies", () => ({
  clearAuthCookies,
}));

describe("auth/logout route", () => {
  beforeEach(() => {
    vi.resetModules();
    clearAuthCookies.mockReset();
  });

  it("clears auth cookies and returns ok response", async () => {
    const { POST } = await import("./route");

    const response = await POST();
    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(clearAuthCookies).toHaveBeenCalledTimes(1);
    expect(clearAuthCookies).toHaveBeenCalledWith(response);
  });
});
