import type { Metadata } from "next";
// Version 1.0.6 - Hardened Against DB Failures
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/components/auth-provider";
import { LocalizationProvider } from "@/contexts/localization-context";

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
  // HARDENED: Never crash the app if branding DB lookup fails
  let branding: any = null;
  try {
    branding = await getTenantBrandingByHost();
  } catch (e) {
    console.error('[layout] generateMetadata branding fetch failed:', e);
  }

  const appName = branding?.app_name || branding?.name || "Enterprise";
  const logoUrl = branding?.logo_url || "/logo-ziona.svg";

  return {
    title: `${appName} - Enterprise ERP`,
    description: `World-class ${appName} Management & ERP System`,
    icons: {
      icon: [
        { url: `${logoUrl}?v=1.0.6`, type: "image/svg+xml" },
      ],
      shortcut: [`${logoUrl}?v=1.0.6`],
      apple: [
        { url: `${logoUrl}?v=1.0.6`, sizes: "180x180", type: "image/svg+xml" },
      ],
    },
    manifest: '/manifest.webmanifest?v=1.0.6',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // HARDENED: This must NEVER crash the app.
  try { await auditAndFixMenuPermissions(); } catch (e) {
    console.error('[layout] auditAndFixMenuPermissions failed silently:', e);
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LocalizationProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
