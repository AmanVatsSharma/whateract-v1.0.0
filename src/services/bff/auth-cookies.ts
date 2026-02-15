/**
 * File: src/services/bff/auth-cookies.ts
 * Module: frontend-bff
 * Purpose: Shared cookie helpers for auth BFF handlers.
 * Author: BharatERP
 * created: 2026-02-15
 */

import { NextResponse } from "next/server";

type AuthCookiePayload = {
  access_token?: string;
  tenant?: {
    id?: string;
  } | null;
};

const baseCookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(response: NextResponse, payload: AuthCookiePayload) {
  if (payload.access_token) {
    response.cookies.set("access_token", payload.access_token, {
      ...baseCookieOptions,
      httpOnly: true,
    });
  }

  const tenantId = payload.tenant?.id;
  if (tenantId) {
    response.cookies.set("tenant_id", tenantId, {
      ...baseCookieOptions,
      httpOnly: false,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("access_token", "", {
    ...baseCookieOptions,
    httpOnly: true,
    maxAge: 0,
  });
  response.cookies.set("tenant_id", "", {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 0,
  });
}
