import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { TEMPLATES_BFF_QUERY } from "@/services/bff/graphql-queries";

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
