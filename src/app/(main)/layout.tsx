/**
 * File: src/app/(main)/layout.tsx
 * Module: frontend-app-shell
 * Purpose: Workspace shell layout for authenticated product routes.
 * Author: BharatERP
 * created: 2026-02-15
 */

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Sidebar />
      <main
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          pt-16
          md:ml-[240px]
          px-4 sm:px-6 lg:px-8
          py-6 sm:py-8
          min-h-[calc(100vh-4rem)]
        `}
      >
        <div className="mx-auto max-w-[1600px] w-full">
          {children}
        </div>
      </main>
    </>
  );
}
