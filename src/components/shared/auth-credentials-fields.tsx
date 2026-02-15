/**
 * File: src/components/shared/auth-credentials-fields.tsx
 * Module: frontend-shared
 * Purpose: Reusable email/password form fields for auth screens.
 * Author: BharatERP
 * created: 2026-02-15
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthCredentialsFieldsProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

export function AuthCredentialsFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: AuthCredentialsFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />
      </div>
    </>
  );
}
