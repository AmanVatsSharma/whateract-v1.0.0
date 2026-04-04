import {
  relayJsonDataResponse,
  relayJsonResponse,
} from "@/services/bff/backend-proxy";
import { inboxFeatureBffGuard } from "@/services/bff/feature-bff-guard";

export async function GET(request: Request) {
  const denied = inboxFeatureBffGuard();
  if (denied) {
    return denied;
  }
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");
  const assignedUserId = url.searchParams.get("assignedUserId");
  const tag = url.searchParams.get("tag");
  if (search) {
    params.set("search", search);
  }
  if (status) {
    params.set("status", status);
  }
  if (assignedUserId) {
    params.set("assignedUserId", assignedUserId);
  }
  if (tag) {
    params.set("tag", tag);
  }
  const path = params.size
    ? `/inbox/conversations?${params.toString()}`
    : "/inbox/conversations";
  return relayJsonResponse(request, path);
}

export async function PATCH(request: Request) {
  const denied = inboxFeatureBffGuard();
  if (denied) {
    return denied;
  }
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
  const denied = inboxFeatureBffGuard();
  if (denied) {
    return denied;
  }
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

export async function DELETE(request: Request) {
  const denied = inboxFeatureBffGuard();
  if (denied) {
    return denied;
  }
  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string;
    action?: "untag";
    tag?: string;
  };
  if (!body.conversationId || body.action !== "untag" || !body.tag) {
    return new Response(
      JSON.stringify({ error: "conversationId, action=untag and tag are required" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  return relayJsonDataResponse(
    request,
    `/inbox/conversations/${body.conversationId}/tags/${encodeURIComponent(body.tag)}`,
    {
      method: "DELETE",
    },
  );
}
