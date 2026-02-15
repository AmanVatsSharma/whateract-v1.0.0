"use client";

import { useEffect, useMemo } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { createLogger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MainErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MainError({ error, reset }: MainErrorProps) {
  const logger = useMemo(() => createLogger("main-segment-error"), []);

  useEffect(() => {
    logger.error("Main segment render failure", error.message, error.digest);
  }, [error, logger]);

  return (
    <div className="mx-auto max-w-xl py-10">
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Something went wrong in this section
          </CardTitle>
          <CardDescription className="text-destructive/90">
            The page failed to render. You can retry immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
