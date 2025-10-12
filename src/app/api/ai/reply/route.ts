import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const base = (body?.text as string) || "";
  // naive suggestion for demo
  const suggestion = base
    ? `Thanks for reaching out! Here is the info you requested.\n\n— Team`
    : "Happy to help! Could you share a bit more about your request?";
  return NextResponse.json({ suggestion });
}
