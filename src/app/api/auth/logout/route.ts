import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/services/bff/auth-cookies";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
