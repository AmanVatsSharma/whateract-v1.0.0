import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const prompt: string = body?.prompt || "";
  const tone: string = body?.tone || "friendly";
  const length: "short" | "medium" | "long" = body?.length || "medium";
  const base = prompt || "Announce a seasonal sale with urgency";
  const content = `(${tone}) ${base}${length === "short" ? "." : length === "long" ? ". Grab your offer today and enjoy exclusive member benefits. Limited stock available!" : " Now live. Limited-time offer!"}`;
  return NextResponse.json({ content });
}
