/**
 * Root Layout Component - Application Shell
 * 
 * Features:
 * - Responsive layout structure
 * - Mobile-first design approach
 * - Theme provider integration
 * - Header and Sidebar composition
 * - Proper spacing and margins for different screen sizes
 * - Metadata configuration
 * 
 * Layout Structure:
 * - Header: Fixed at top (h-16)
 * - Sidebar: Fixed left side (hidden on mobile, drawer-based)
 * - Main Content: Responsive margins based on screen size
 * 
 * @layout
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Providers from "@/app/providers";

/**
 * Configure Inter font with Latin subset
 */
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Application metadata
 */
export const metadata: Metadata = {
  title: "Whaterakt - WhatsApp Marketing Platform",
  description: "Modern WhatsApp marketing platform with advanced automation, analytics, and campaign management",
  keywords: ["whatsapp", "marketing", "automation", "campaigns", "analytics"],
  authors: [{ name: "Whaterakt Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

/**
 * Root Layout Component
 * 
 * Responsive Behavior:
 * - Mobile (< 768px): Full width content, no sidebar offset, hamburger menu
 * - Desktop (>= 768px): Sidebar visible, content offset by sidebar width
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('RootLayout: Rendering application layout');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* 
          Providers wrapper for:
          - Theme management
          - Query client (React Query)
          - Toast notifications
          - Other context providers
        */}
        <Providers>
          {/* 
            App Structure:
            1. Header - Fixed at top, full width
            2. Sidebar - Fixed left, responsive (drawer on mobile)
            3. Main Content - Responsive margins
          */}
          
          {/* Fixed Header */}
          <Header />
          
          {/* Sidebar (Desktop: fixed left, Mobile: drawer) */}
          <Sidebar />
          
          {/* Main Content Area with Responsive Layout */}
          <main
            className={`
              min-h-screen
              transition-all duration-300 ease-in-out
              
              /* Spacing from top for fixed header (16 = 64px header height) */
              pt-16
              
              /* Mobile: No left margin (sidebar is drawer) */
              /* Desktop: Left margin for fixed sidebar */
              md:ml-[240px]
              
              /* Responsive padding */
              px-4 sm:px-6 lg:px-8
              py-6 sm:py-8
              
              /* Ensure proper min-height accounting for header */
              min-h-[calc(100vh-4rem)]
            `}
          >
            {/* 
              Content wrapper with max-width for better readability on large screens
              and proper spacing
            */}
            <div className="mx-auto max-w-[1600px] w-full">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
