/**
 * File: src/components/shared/section-loader.tsx
 * Module: frontend-shared-components
 * Purpose: Small reusable loading section placeholder.
 * Author: Aman Sharma / Novologic/ Codex
 * Last-updated: 2026-02-15
 * Notes:
 * - Used across feature pages during async data loading.
 * - Keep styling neutral to match both light/dark themes.
 */

export function SectionLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

