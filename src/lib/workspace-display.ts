/**
 * @file workspace-display.ts
 * @module lib
 * @description Reads non-secret display cookies set by the auth BFF (tenant label, user email).
 * @author Whaterakt
 * @created 2026-04-04
 */

export function readBrowserCookie(name: string): string {
  if (typeof document === "undefined") {
    return "";
  }
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function initialsFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() || "";
  if (local.length >= 2) {
    return local.slice(0, 2).toUpperCase();
  }
  return local.toUpperCase() || "·";
}
