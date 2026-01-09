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

            // Strict Role Redirects
            if (isLoggedIn && auth?.user) {
                const email = auth.user.email;
                const role = (auth.user as any).role?.toLowerCase();

                // Receptionist
                if ((email === 'rece@live.com' || role === 'receptionist') && (isOnRoot || isAuthPage)) {
                    return Response.redirect(new URL("/hms/reception/dashboard", nextUrl));
                }
                // Nurse
                if ((email === 'nurs@live.com' || role === 'nurse') && (isOnRoot || isAuthPage)) {
                    return Response.redirect(new URL("/hms/nursing/dashboard", nextUrl));
                }
                // Doctor
                if ((email === 'doct@live.com' || role === 'doctor') && (isOnRoot || isAuthPage)) {
                    return Response.redirect(new URL("/hms/doctor/dashboard", nextUrl));
                }
            }

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
