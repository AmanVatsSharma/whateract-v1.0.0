import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whaterakt",
  description: "WhatsApp marketing platform UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <div className="flex w-full">
            <Sidebar />
            <div className="ml-[240px] w-full pt-16">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
