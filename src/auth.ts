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
                    // Use raw query to verify password with pgcrypto
                    const users = await prisma.$queryRaw`
            SELECT id, email, name, is_admin, is_tenant_admin, tenant_id, company_id
            FROM app_user
            WHERE email = ${credentials.email}
              AND password = crypt(${credentials.password}, password)
          ` as any[];


                    if (users && users.length > 0) {
                        const user = users[0];

                        // Fetch Company & Modules
                        const company = await prisma.company.findFirst({ where: { id: user.company_id } });
                        const tenantModules = await prisma.tenant_module.findMany({
                            where: { tenant_id: user.tenant_id, enabled: true },
                            select: { module_key: true }
                        });
                        const moduleKeys = tenantModules.map(m => m.module_key);

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
                        };
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
                token.isAdmin = user.isAdmin;
                token.isTenantAdmin = user.isTenantAdmin;
                token.companyId = user.companyId;
                token.tenantId = user.tenantId;
                token.industry = user.industry;
                token.hasCRM = user.hasCRM;
                token.hasHMS = user.hasHMS;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
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
