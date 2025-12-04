/**
 * Providers Component - Application-wide Context Providers
 * 
 * This component wraps the entire application with necessary providers:
 * - ThemeProvider: Manages light/dark theme with next-themes
 * - QueryClientProvider: React Query for data fetching
 * - Toaster: Toast notifications with sonner
 * 
 * Features:
 * - Modern light theme as default (professional & clean)
 * - Dark mode support with smooth transitions
 * - Optimized React Query configuration
 * - Rich, colorful toast notifications
 * - System theme detection support
 * 
 * @component
 * @version 2.0.0
 */

"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

/**
 * React Query Client Configuration
 * Optimized for performance and user experience
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on window focus (better UX)
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

/**
 * Main Providers Component
 * Wraps the application with all necessary context providers
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Wrapped application with providers
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // Log theme initialization for debugging
  React.useEffect(() => {
    console.log("🎨 Providers: Application providers initialized");
    console.log("💡 Theme: Modern light theme (default)");
    console.log("🌙 Dark mode: Available via theme toggle");
    console.log("📊 React Query: Configured with optimized settings");
  }, []);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          richColors 
          position="top-right"
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: "bg-card border-border",
              title: "text-foreground font-semibold",
              description: "text-muted-foreground",
              success: "bg-success/10 border-success/20",
              error: "bg-destructive/10 border-destructive/20",
              warning: "bg-warning/10 border-warning/20",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
