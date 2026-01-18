import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    // Normalize email
                    const email = (credentials.email as string).toLowerCase()

                    // Use raw query to verify password with pgcrypto (Case Insensitive Email)
                    const users = await prisma.$queryRaw`
                        SELECT id, email, name, is_admin, is_tenant_admin, tenant_id, company_id, password, role, metadata
                        FROM app_user
                        WHERE LOWER(email) = ${email}
                          AND is_active = true
                          AND password = crypt(${credentials.password}, password)
                    ` as any[];

                    if (users && users.length > 0) {
                        const user = users[0];

                        try {
                            // Fetch Company & Modules
                            const company = user.company_id ? await prisma.company.findFirst({ where: { id: user.company_id } }) : null;
                            const tenantModules = await prisma.tenant_module.findMany({
                                where: { tenant_id: user.tenant_id, enabled: true },
                                select: { module_key: true }
                            });
                            const moduleKeys = tenantModules.map(m => m.module_key);

                            // Extract Avatar from metadata
                            const metadata = user.metadata as any;
                            const avatarUrl = metadata?.avatar_url || null;
                            const safeImage = avatarUrl?.startsWith('data:') ? null : avatarUrl;

                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                isAdmin: user.is_admin,
                                isTenantAdmin: user.is_tenant_admin,
                                companyId: user.company_id,
                                tenantId: user.tenant_id,
                                industry: company?.industry || '',
                                hasCRM: moduleKeys.includes('crm'),
                                hasHMS: moduleKeys.includes('hms'),
                                role: user.role,
                                image: safeImage
                            };
                        } catch (dbError) {
                            console.error("Auth Data Fetch Error:", dbError)
                            return null;
                        }
                    } else {
                        console.log("Auth Failed: User not found or password verification failed for", email)
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            // PROACTIVE SECURITY: Always clear base64 data from the token on every pass
            // This prevents 431 Header Too Large errors if a giant string somehow got into the cookie.
            if (token.image && typeof token.image === 'string' && token.image.startsWith('data:')) {
                token.image = null;
            }

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.isAdmin = user.isAdmin;
                token.isTenantAdmin = user.isTenantAdmin;
                token.companyId = user.companyId;
                token.tenantId = user.tenantId;
                token.industry = user.industry;
                token.hasCRM = user.hasCRM;
                token.hasHMS = user.hasHMS;
                token.role = user.role;
                // ONLY store real URLs in the token, NOT base64 data URIs
                token.image = user.image?.startsWith('data:') ? null : user.image;
            }

            // Handle profile updates manually via trigger
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.companyId) token.companyId = session.companyId;
                // Same here: avoid base64 in session
                if (session.image) {
                    token.image = session.image.startsWith('data:') ? null : session.image;
                }
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.isAdmin = token.isAdmin;
                session.user.role = token.role;
                session.user.isTenantAdmin = token.isTenantAdmin;
                session.user.companyId = token.companyId;
                session.user.tenantId = token.tenantId;
                session.user.industry = token.industry;
                session.user.hasCRM = token.hasCRM;
                session.user.hasHMS = token.hasHMS;
                session.user.image = token.image;
            }
            return session;
        }
    }
})
