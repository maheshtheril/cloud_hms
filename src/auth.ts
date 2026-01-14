import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
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
                        SELECT id, email, name, is_admin, is_tenant_admin, tenant_id, company_id, password, metadata, role
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

                            // SECURITY/PERFORMANCE: Avoid storing massive base64 images in session cookie (causes 431 errors)
                            const rawAvatar = user.metadata?.avatar_url || null;
                            const safeAvatar = (typeof rawAvatar === 'string' && rawAvatar.startsWith('data:') && rawAvatar.length > 5000)
                                ? null
                                : rawAvatar;

                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                image: safeAvatar,
                                isAdmin: user.is_admin,
                                isTenantAdmin: user.is_tenant_admin,
                                companyId: user.company_id,
                                tenantId: user.tenant_id,
                                industry: company?.industry || '',
                                hasCRM: moduleKeys.includes('crm'),
                                hasHMS: moduleKeys.includes('hms'),
                                role: user.role
                            };
                        } catch (dbError) {
                            console.error("Auth Data Fetch Error:", dbError)
                            // return partial session or fail? Fail is safer.
                            return null;
                        }
                    } else {
                        console.log("Auth Failed: User not found or password verification failed for", email)
                        // Debugging: Check if user exists without password check
                        const debugUser = await prisma.app_user.findFirst({ where: { email: email } })
                        if (debugUser) {
                            console.log("Debug: User exists, password mismatch.")
                        } else {
                            console.log("Debug: User does nit exist.")
                        }
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
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.picture = user.image;
                token.isAdmin = user.isAdmin;
                token.isTenantAdmin = user.isTenantAdmin;
                token.companyId = user.companyId;
                token.tenantId = user.tenantId;
                token.industry = user.industry;
                token.hasCRM = user.hasCRM;
                token.hasHMS = user.hasHMS;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.isAdmin = token.isAdmin;
                session.user.role = token.role;
                session.user.isTenantAdmin = token.isTenantAdmin;
                session.user.companyId = token.companyId;
                session.user.tenantId = token.tenantId;
                session.user.industry = token.industry;
                session.user.hasCRM = token.hasCRM;
                session.user.hasHMS = token.hasHMS;
            }
            return session;
        }
    }
})
