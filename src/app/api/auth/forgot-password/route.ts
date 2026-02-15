import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  if (!body.email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    message:
      "If the email exists, a reset link will be sent. [SonuRamTODO] Wire real backend reset workflow.",
  });
}
