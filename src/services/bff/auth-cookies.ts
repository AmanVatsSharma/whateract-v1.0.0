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
    name?: string | null;
  } | null;
};

type AuthCookieOptions = {
  /** Non-secret display only; keeps shell in sync after login. */
  userEmail?: string;
};

const baseCookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  payload: AuthCookiePayload,
  options?: AuthCookieOptions,
) {
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

  const tenantLabel = payload.tenant?.name?.trim();
  if (tenantLabel) {
    response.cookies.set("tenant_label", tenantLabel, {
      ...baseCookieOptions,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const userEmail = options?.userEmail?.trim();
  if (userEmail) {
    response.cookies.set("user_email", userEmail, {
      ...baseCookieOptions,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
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
  response.cookies.set("tenant_label", "", {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 0,
  });
  response.cookies.set("user_email", "", {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 0,
  });
}
