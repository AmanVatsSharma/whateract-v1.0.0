import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    token?: string;
    password?: string;
  };
  if (!body.token || !body.password) {
    return NextResponse.json(
      { error: "token and password are required" },
      { status: 400 }
    );
  }
  return NextResponse.json({
    ok: true,
    message:
      "Password reset flow is staged. [SonuRamTODO] Connect backend reset endpoint.",
  });
}
