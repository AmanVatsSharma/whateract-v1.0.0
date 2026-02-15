"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthCredentialsFields } from "@/components/shared/auth-credentials-fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAndLogin } from "@/features/auth/services/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const auth = await registerAndLogin({ tenantName, email, password });
      if (auth.mfaRequired) {
        toast.error("MFA challenge required. Complete MFA flow first.");
        return;
      }
      toast.success("Workspace created");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Set up your WhatsApp marketing workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Workspace name</Label>
              <Input
                id="tenantName"
                value={tenantName}
                onChange={(event) => setTenantName(event.target.value)}
                required
              />
            </div>
            <AuthCredentialsFields
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? "Creating..." : "Create workspace"}
            </Button>
          </form>
          <div className="mt-4 text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
