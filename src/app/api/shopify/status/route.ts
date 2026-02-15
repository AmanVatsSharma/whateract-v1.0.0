import { relayJsonDataResponse } from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonDataResponse(request, "/shopify/status");
}

