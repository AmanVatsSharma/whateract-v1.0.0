import { relayJsonResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonResponse(request, "/shopify/status");
}

