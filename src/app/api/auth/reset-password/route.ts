import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonDataResponse(request, "/auth/reset-password", {
    method: "POST",
    body,
  });
}
