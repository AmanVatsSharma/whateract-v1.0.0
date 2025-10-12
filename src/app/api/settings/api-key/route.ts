import { NextResponse } from "next/server";

export async function POST() {
  // deterministic-looking demo key
  const key = `sk_live_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  return NextResponse.json({ key });
}
