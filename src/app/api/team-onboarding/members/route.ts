import { relayJsonResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const teamId = url.searchParams.get("teamId");
  const path = teamId
    ? `/team-onboarding/members?teamId=${encodeURIComponent(teamId)}`
    : "/team-onboarding/members";
  return relayJsonResponse(request, path);
}

