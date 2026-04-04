import { NextResponse } from "next/server";
import { setAuthCookies } from "@/services/bff/auth-cookies";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { LOGIN_BFF_MUTATION } from "@/services/bff/graphql-queries";

type LoginGraphqlData = {
  login: {
    access_token?: string;
    mfaRequired?: boolean;
    challengeId?: string;
    challengeExpiresAt?: string;
    tenant?: {
      id?: string;
      name?: string;
    } | null;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    const payload = await proxyGraphql<LoginGraphqlData>(
      request,
      LOGIN_BFF_MUTATION,
      {
        input: {
          email: body.email,
          password: body.password,
        },
      }
    );
    const response = NextResponse.json({ data: payload.login });
    setAuthCookies(response, payload.login, { userEmail: body.email });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to login",
      },
      { status: 502 }
    );
  }
}
