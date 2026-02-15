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
    createdAt: string;
  }>;
};

export async function GET(request: Request) {
  try {
    const payload = await proxyGraphql<AudienceGraphqlData>(
      request,
      CONTACTS_BFF_QUERY
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
