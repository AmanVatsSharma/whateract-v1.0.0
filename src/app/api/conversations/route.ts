import {
  relayJsonDataResponse,
  relayJsonResponse,
} from "@/services/bff/backend-proxy";

export async function GET(request: Request) {
  return relayJsonResponse(request, "/inbox/conversations");
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string;
    action?: "assign" | "status";
    userId?: string;
    status?: "OPEN" | "PENDING" | "CLOSED";
  };
  if (!body.conversationId || !body.action) {
    return new Response(
      JSON.stringify({ error: "conversationId and action are required" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  if (body.action === "assign") {
    return relayJsonDataResponse(
      request,
      `/inbox/conversations/${body.conversationId}/assignment`,
      {
        method: "PATCH",
        body: { userId: body.userId },
      },
    );
  }

  return relayJsonDataResponse(
    request,
    `/inbox/conversations/${body.conversationId}/status`,
    {
      method: "PATCH",
      body: { status: body.status },
    },
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string;
    action?: "note" | "tag" | "message";
    content?: string;
    tag?: string;
    message?: string;
  };
  if (!body.conversationId || !body.action) {
    return new Response(
      JSON.stringify({ error: "conversationId and action are required" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  if (body.action === "note") {
    return relayJsonDataResponse(
      request,
      `/inbox/conversations/${body.conversationId}/notes`,
      {
        method: "POST",
        body: { content: body.content },
      },
    );
  }
  if (body.action === "tag") {
    return relayJsonDataResponse(
      request,
      `/inbox/conversations/${body.conversationId}/tags`,
      {
        method: "POST",
        body: { tag: body.tag },
      },
    );
  }
  return relayJsonDataResponse(
    request,
    `/inbox/conversations/${body.conversationId}/messages`,
    {
      method: "POST",
      body: { message: body.message },
    },
  );
}
