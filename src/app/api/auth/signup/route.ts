import { NextResponse } from "next/server";
import { setAuthCookies } from "@/services/bff/auth-cookies";
import { proxyGraphql } from "@/services/bff/backend-proxy";
import { REGISTER_AND_LOGIN_BFF_MUTATION } from "@/services/bff/graphql-queries";

type SignupGraphqlData = {
  registerAndLogin: {
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
      tenantName?: string;
      otpCode?: string;
    };
    if (!body.email || !body.password || !body.tenantName) {
      return NextResponse.json(
        { error: "email, password and tenantName are required" },
        { status: 400 }
      );
    }

    const payload = await proxyGraphql<SignupGraphqlData>(
      request,
      REGISTER_AND_LOGIN_BFF_MUTATION,
      {
        input: {
          email: body.email,
          password: body.password,
          tenantName: body.tenantName,
          otpCode: body.otpCode,
        },
      }
    );

    const response = NextResponse.json({ data: payload.registerAndLogin });
    setAuthCookies(response, payload.registerAndLogin);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to sign up",
      },
      { status: 502 }
    );
  }
}
