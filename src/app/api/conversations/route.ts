import { NextResponse } from "next/server";
import { mocks } from "@/lib/mock-adapter";

export async function GET() {
  try {
    const data = (await mocks.handle("GET", "/conversations")) as unknown;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
