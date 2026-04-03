/**
 * File: src/app/api/audience/route.ts
 * Module: frontend-bff
 * Purpose: BFF audience contact list proxy with segment/search filters.
 * Author: BharatERP
 * created: 2026-02-16
 */
import { NextResponse } from "next/server";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { CONTACTS_BFF_QUERY } from "@/services/bff/graphql-queries";

type AudienceGraphqlData = {
  contacts: Array<{
    id: string;
    phone: string;
    firstName?: string | null;
    lastName?: string | null;
    userId: string;
    subscribed: boolean;
    tags?: string[] | null;
    createdAt: string;
  }>;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const segmentId = url.searchParams.get("segmentId");
    const payload = await proxyGraphql<AudienceGraphqlData>(
      request,
      CONTACTS_BFF_QUERY,
      {
        search: search || null,
        segmentId: segmentId || null,
      },
    );
    return NextResponse.json({ data: payload.contacts || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load audience",
      },
      { status: 502 }
    );
  }
}
