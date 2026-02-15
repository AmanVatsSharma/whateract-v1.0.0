import { relayJsonResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonResponse(request, "/team-onboarding/invites", {
    method: "POST",
    body,
  });
}

