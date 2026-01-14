import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme-context";

// Force dynamic rendering for all pages to prevent build-time database access
export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud HMS - Enterprise ERP",
  description: "World-class Hospital Management & ERP System",
};

import { auditAndFixMenuPermissions } from "@/app/actions/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SELF-HEALING: Ensure DB integrity on every page load (temporary fix)
  // CRITICAL: Disabled because it's too expensive to run on every request (100+ DB writes)
  // await auditAndFixMenuPermissions();

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
