import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import {
  CREATE_TEMPLATE_BFF_MUTATION,
  DELETE_TEMPLATE_BFF_MUTATION,
  SET_TEMPLATE_STATUS_BFF_MUTATION,
  TEMPLATES_BFF_QUERY,
  UPDATE_TEMPLATE_BFF_MUTATION,
} from "@/services/bff/graphql-queries";

type TemplatesGraphqlData = {
  templates: Array<{
    id: string;
    name: string;
    content?: string | null;
    category?: string | null;
    status?: string | null;
    createdAt?: string | null;
  }>;
};

type TemplateMutationData = {
  createTemplate?: TemplatesGraphqlData["templates"][number];
  updateTemplate?: TemplatesGraphqlData["templates"][number];
  setTemplateStatus?: TemplatesGraphqlData["templates"][number];
  deleteTemplate?: boolean;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<TemplatesGraphqlData>(
      request,
      TEMPLATES_BFF_QUERY
    );
    return NextResponse.json({ data: payload.templates || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load templates",
      },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await proxyGraphql<TemplateMutationData>(
      request,
      CREATE_TEMPLATE_BFF_MUTATION,
      { input: body },
    );
    return NextResponse.json({ data: payload.createTemplate });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create template",
      },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const templateId = String(body?.templateId || "").trim();
    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    const mutation =
      body?.status && !body?.name && !body?.content && !body?.category
        ? SET_TEMPLATE_STATUS_BFF_MUTATION
        : UPDATE_TEMPLATE_BFF_MUTATION;
    const variables =
      mutation === SET_TEMPLATE_STATUS_BFF_MUTATION
        ? { templateId, status: body.status }
        : {
            templateId,
            input: {
              name: body?.name,
              content: body?.content,
              category: body?.category,
              status: body?.status,
            },
          };
    const payload = await proxyGraphql<TemplateMutationData>(
      request,
      mutation,
      variables,
    );
    return NextResponse.json({
      data: payload.updateTemplate || payload.setTemplateStatus || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update template",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const paramTemplateId = url.searchParams.get("templateId") || "";
    const body = await request.json().catch(() => ({}));
    const templateId = String(body?.templateId || paramTemplateId).trim();
    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    const payload = await proxyGraphql<TemplateMutationData>(
      request,
      DELETE_TEMPLATE_BFF_MUTATION,
      { templateId },
    );
    return NextResponse.json({ data: Boolean(payload.deleteTemplate) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete template",
      },
      { status: 502 },
    );
  }
}
