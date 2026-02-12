import type { Metadata } from "next";
// Version 1.0.5 - Cache Busting PWA Icons
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
import { auditAndFixMenuPermissions } from "./actions/navigation";

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getTenantBrandingByHost();
  const appName = branding?.app_name || branding?.name || "Enterprise";

  return {
    title: `${appName} - Enterprise ERP`,
    description: `World-class ${appName} Management & ERP System`,
    icons: {
      icon: [
        { url: `${branding?.logo_url || "/logo-ziona.svg"}?v=1.0.5`, type: "image/svg+xml" },
      ],
      shortcut: [`${branding?.logo_url || "/logo-ziona.svg"}?v=1.0.5`],
      apple: [
        { url: `${branding?.logo_url || "/logo-ziona.svg"}?v=1.0.5`, sizes: "180x180", type: "image/svg+xml" },
      ],
    },

    manifest: '/manifest.webmanifest?v=1.0.5',
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: appName,
    },
    formatDetection: {
      telephone: false,
    },
  };
}


import { AuthProvider } from "@/components/auth-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SELF-HEALING: Ensuring menu items and permissions are standardized.
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
