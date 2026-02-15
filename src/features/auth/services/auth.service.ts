/**
 * File: src/features/auth/services/auth.service.ts
 * Module: frontend-auth
 * Purpose: Frontend auth API service wrappers for login/signup/reset flows.
 * Author: BharatERP
 * created: 2026-02-15
 */

import { apiClient } from "@/lib/api-client";

type AuthPayload = {
  access_token?: string;
  mfaRequired?: boolean;
  challengeId?: string;
  challengeExpiresAt?: string;
  tenant?: {
    id?: string;
    name?: string;
  } | null;
};

type AuthResponse = {
  data?: AuthPayload;
  error?: string;
};

export async function loginWithPassword(payload: {
  email: string;
  password: string;
}) {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function registerAndLogin(payload: {
  email: string;
  password: string;
  tenantName: string;
  otpCode?: string;
}) {
  const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function requestPasswordReset(payload: { email: string }) {
  const response = await apiClient.post<{
    data?: { ok?: boolean; message?: string };
    error?: string;
  }>(
    "/auth/forgot-password",
    payload
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function resetPassword(payload: { token: string; password: string }) {
  const response = await apiClient.post<{
    data?: { ok?: boolean; message?: string };
    error?: string;
  }>(
    "/auth/reset-password",
    payload
  );
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
  return response.data?.data || {};
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
