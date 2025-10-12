import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  // pretend to validate
  if (!body?.url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
