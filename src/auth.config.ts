import type { NextAuthConfig } from "next-auth"


export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const user = auth?.user as any;

            const isOnHMS = nextUrl.pathname.startsWith("/hms");
            const isOnCRM = nextUrl.pathname.startsWith("/crm");
            const isOnRoot = nextUrl.pathname === "/";
            const isAuthPage = nextUrl.pathname.startsWith("/login");
            const isReceptionDashboard = nextUrl.pathname === "/hms/reception/dashboard";

            // Permissions-based redirection is handled in src/app/page.tsx
            // This middleware only handles session validation and basic module access checks

            if (isOnHMS || isOnCRM || isOnRoot) {
                if (isLoggedIn) {
                    // STRICT ACCESS CONTROL
                    // If trying to access HMS but has no HMS module/industry -> Redirect
                    if (isOnHMS) {
                        // FIX: Explicitly check modules. If user has CRM but NOT HMS, redirect to CRM.
                        // Independent of industry fallback which might be misleading.
                        if (user.hasCRM && !user.hasHMS) {
                            return Response.redirect(new URL("/crm/dashboard", nextUrl));
                        }
                    }
                    return true;
                }
                return false // Redirect unauthenticated
            } else if (isLoggedIn && isAuthPage) {
                // Check if we are forcing a re-login/re-auth (e.g. from a loop break)
                if (nextUrl.searchParams.has("reauth")) {
                    return true;
                }
                return Response.redirect(new URL("/", nextUrl))
            }
            return true
        },
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.isTenantAdmin = token.isTenantAdmin as boolean;
            }
            return session;
        }
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
