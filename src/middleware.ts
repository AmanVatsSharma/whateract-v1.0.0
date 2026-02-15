/**
 * File: src/middleware.ts
 * Module: frontend-auth
 * Purpose: Baseline route protection and auth signal propagation.
 * Author: Aman Sharma / Vedpragya/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Strict mode blocks unauthenticated users on protected routes.
 * - Optional mode keeps current UX while wiring auth boundaries.
 */

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PAGE_PREFIXES = [
  "/dashboard",
  "/campaigns",
  "/inbox",
  "/analytics",
  "/automations",
  "/audience",
  "/message-templates",
  "/scheduler",
  "/notifications",
  "/shopify",
  "/team",
  "/settings",
];

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

function hasAuth(request: NextRequest): boolean {
  const authorization = request.headers.get("authorization");
  const cookieToken = request.cookies.get("access_token")?.value;
  return Boolean(authorization || cookieToken);
}

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const mode = process.env.NEXT_PUBLIC_AUTH_MODE || "optional";
  const authenticated = hasAuth(request);
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next();
  response.headers.set("x-auth-state", authenticated ? "present" : "missing");

  if (mode !== "strict") {
    return response;
  }

  if (pathname.startsWith("/api/") && !authenticated && !isPublicApi(pathname)) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (isProtectedPage(pathname) && !authenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

