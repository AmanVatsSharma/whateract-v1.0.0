import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["general", "bug", "feature", "incident"]).default("general"),
  message: z.string().min(10, "message must have at least 10 characters"),
  email: z.string().email().optional(),
  source: z.string().min(1).max(120).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid feedback payload",
      },
      { status: 400 },
    );
  }

  const ticketId = `fbk_${randomUUID()}`;
  return NextResponse.json(
    {
      data: {
        ticketId,
        acceptedAt: new Date().toISOString(),
      },
    },
    { status: 202 },
  );
}
