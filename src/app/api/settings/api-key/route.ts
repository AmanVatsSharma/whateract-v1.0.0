import { relayJsonResponse } from "@/services/bff/backend-proxy";

export async function POST(request: Request) {
  return relayJsonResponse(request, "/integrations/api-keys/generate", {
    method: "POST",
  });
}
