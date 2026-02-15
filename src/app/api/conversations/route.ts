import { relayJsonResponse } from "@/services/backend/backend-proxy";

export async function GET(request: Request) {
  return relayJsonResponse(request, "/inbox/conversations");
}
