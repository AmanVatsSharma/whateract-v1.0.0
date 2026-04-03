/**
 * File: src/app/api/audience/segments/route.ts
 * Module: frontend-bff
 * Purpose: BFF route for audience segment summaries.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { AUDIENCE_SEGMENTS_BFF_QUERY } from "@/services/bff/graphql-queries";

type AudienceSegmentsGraphqlData = {
  audienceSegments: Array<{
    id: string;
    name: string;
    description: string;
    count: number;
  }>;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<AudienceSegmentsGraphqlData>(
      request,
      AUDIENCE_SEGMENTS_BFF_QUERY,
    );
    return NextResponse.json({ data: payload.audienceSegments || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load audience segments",
      },
      { status: 502 },
    );
  }
}
