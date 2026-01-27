import type { Metadata } from "next";
// Version 1.0.4 - Triggering Redeploy
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

import { getTenantBrandingByHost } from "./actions/branding";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getTenantBrandingByHost();
  const appName = branding?.app_name || branding?.name || "HMS";

  return {
    title: `${appName} - Enterprise ERP`,
    description: `World-class ${appName} Management & ERP System`,
  };
}

import { AuthProvider } from "@/components/auth-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SELF-HEALING: Disabled because it's too expensive (100+ DB writes per request) 
  // and causes hanging/performance issues. 
  // await auditAndFixMenuPermissions();

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
