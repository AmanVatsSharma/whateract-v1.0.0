import { relayJsonResponse } from "@/services/backend/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonResponse(request, "/ai/reply", {
    method: "POST",
    body,
  });
}
