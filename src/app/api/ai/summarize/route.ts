import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const id: string | undefined = body?.conversationId;
  const summary = `Summary for ${id || "conversation"}:
- Customer asked for catalog
- Agent responded with a link
- Pending: confirm product availability`;
  return NextResponse.json({ summary });
}
