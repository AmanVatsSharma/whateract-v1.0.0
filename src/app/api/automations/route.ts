import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import {
  AUTOMATIONS_BFF_QUERY,
  CREATE_AUTOMATION_BFF_MUTATION,
  DELETE_AUTOMATION_BFF_MUTATION,
  UPDATE_AUTOMATION_BFF_MUTATION,
} from "@/services/bff/graphql-queries";

type AutomationsGraphqlData = {
  automations: Array<{
    id: string;
    type: string;
    enabled: boolean;
    trigger?: string | null;
    definitionJson?: string | null;
    stepsCount?: number;
    conditionsCount?: number;
    createdAt?: string | null;
  }>;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<AutomationsGraphqlData>(
      request,
      AUTOMATIONS_BFF_QUERY
    );
    return NextResponse.json({ data: payload.automations || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load automations",
      },
      { status: 502 }
    );
  }
}

type AutomationMutationData = {
  createAutomation: AutomationsGraphqlData["automations"][number];
  updateAutomation: AutomationsGraphqlData["automations"][number];
  deleteAutomation: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      type?: string;
      trigger?: string;
      enabled?: boolean;
      definition?: Record<string, unknown>;
    };
    if (!body.type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }
    const payload = await proxyGraphql<AutomationMutationData>(
      request,
      CREATE_AUTOMATION_BFF_MUTATION,
      {
        type: body.type,
        trigger: body.trigger || null,
        enabled: body.enabled ?? true,
        definitionJson: body.definition ? JSON.stringify(body.definition) : null,
      },
    );
    return NextResponse.json({ data: payload.createAutomation });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create automation",
      },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      automationId?: string;
      type?: string;
      trigger?: string;
      enabled?: boolean;
      definition?: Record<string, unknown>;
    };
    if (!body.automationId) {
      return NextResponse.json(
        { error: "automationId is required" },
        { status: 400 },
      );
    }
    const payload = await proxyGraphql<AutomationMutationData>(
      request,
      UPDATE_AUTOMATION_BFF_MUTATION,
      {
        automationId: body.automationId,
        type: body.type ?? null,
        trigger: body.trigger ?? null,
        enabled: body.enabled ?? null,
        definitionJson: body.definition ? JSON.stringify(body.definition) : null,
      },
    );
    return NextResponse.json({ data: payload.updateAutomation });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update automation",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      automationId?: string;
    };
    if (!body.automationId) {
      return NextResponse.json(
        { error: "automationId is required" },
        { status: 400 },
      );
    }
    const payload = await proxyGraphql<AutomationMutationData>(
      request,
      DELETE_AUTOMATION_BFF_MUTATION,
      { automationId: body.automationId },
    );
    return NextResponse.json({ data: { ok: Boolean(payload.deleteAutomation) } });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete automation",
      },
      { status: 502 },
    );
  }
}
