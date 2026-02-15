import { relayJsonResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonResponse(request, "/integrations/workspace-settings");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return relayJsonResponse(request, "/integrations/workspace-settings", {
    method: "POST",
    body,
  });
}
