import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'

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

                    // Use raw query to fetch user (Case Insensitive Email)
                    const users = await prisma.$queryRaw`
                        SELECT id, email, name, is_admin, is_tenant_admin, tenant_id, company_id, current_branch_id, password, role, metadata
                        FROM app_user
                        WHERE LOWER(email) = ${email}
                          AND is_active = true
                    ` as any[];

                    if (users && users.length > 0) {
                        let user = users[0];

                        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
                        if (!passwordsMatch) return null;

                        try {
                            // Fetch Branch Name
                            let branchName = 'Main Branch';
                            if (user.current_branch_id) {
                                const branch = await prisma.hms_branch.findUnique({
                                    where: { id: user.current_branch_id },
                                    select: { name: true }
                                });
                                if (branch) branchName = branch.name;
                            }

                            // --- GENERIC MULTI-TENANT SELF-HEALING ---
                            // Ensure every user has a company within their tenant
                            if (user.tenant_id && !user.company_id) {
                                console.log(`[AUTH] User ${user.email} missing company link. Initializing...`);

                                let defaultCompany = await prisma.company.findFirst({
                                    where: { tenant_id: user.tenant_id }
                                });

                                if (!defaultCompany) {
                                    defaultCompany = await prisma.company.create({
                                        data: {
                                            tenant_id: user.tenant_id,
                                            name: "Default Company",
                                            industry: "General"
                                        }
                                    });
                                }

                                await prisma.app_user.update({
                                    where: { id: user.id },
                                    data: { company_id: defaultCompany.id }
                                });
                                user.company_id = defaultCompany.id;
                            }

                            // Fetch Tenant & Entitlements
                            const tenantInfo = await prisma.tenant.findUnique({
                                where: { id: user.tenant_id },
                                select: { db_url: true, slug: true, name: true }
                            });

                            const company = user.company_id ? await prisma.company.findFirst({ where: { id: user.company_id } }) : null;

                            const tenantModules = await prisma.tenant_module.findMany({
                                where: { tenant_id: user.tenant_id, enabled: true },
                                select: { module_key: true }
                            });

                            let moduleKeys = tenantModules.map(m => m.module_key);

                            // Domain-specific enforcement (e.g., seeakk.com only wants CRM)
                            if (tenantInfo?.slug === 'seeakk') {
                                moduleKeys = ['crm'];
                            }

                            // Extract Avatar
                            const metadata = user.metadata as any;
                            const avatarUrl = metadata?.avatar_url || null;
                            const safeImage = avatarUrl?.startsWith('data:') ? null : avatarUrl;

                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                role: user.role,
                                isAdmin: user.is_admin,
                                isTenantAdmin: user.is_tenant_admin,
                                tenantId: user.tenant_id,
                                companyId: user.company_id,
                                companyName: company ? company.name : (tenantInfo?.name || 'My Business'),
                                current_branch_id: user.current_branch_id,
                                current_branch_name: branchName,
                                modules: moduleKeys,
                                image: safeImage,
                                dbUrl: tenantInfo?.db_url,

                                industry: company?.industry || 'General',
                                hasCRM: moduleKeys.includes('crm'),
                                hasHMS: moduleKeys.includes('hms')
                            };
                        } catch (innerError) {
                            console.error("Error fetching user details (company/tenant):", innerError);
                            return null;
                        }
                    } else {
                        return null; // Invalid credentials
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            if (user) {
                const u = user as any;
                token.id = u.id;
                token.tenantId = u.tenantId;
                token.companyId = u.companyId;
                token.role = u.role;
                token.modules = u.modules;
                token.isAdmin = u.isAdmin;
                token.isTenantAdmin = u.isTenantAdmin;
                token.industry = u.industry;
                token.hasCRM = u.hasCRM;
                token.hasHMS = u.hasHMS;
                token.dbUrl = u.dbUrl;
                token.current_branch_id = u.current_branch_id;
                token.current_branch_name = u.current_branch_name;
            }
            if (trigger === "update" && session) {
                if (session.companyId) token.companyId = session.companyId;
                if (session.branchId) token.current_branch_id = session.branchId;
                if (session.branchName) token.current_branch_name = session.branchName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                const u = session.user as any;
                u.tenantId = token.tenantId;
                u.companyId = token.companyId;
                u.role = token.role;
                u.modules = token.modules;
                u.isAdmin = token.isAdmin;
                u.isTenantAdmin = token.isTenantAdmin;
                u.industry = token.industry;
                u.hasCRM = token.hasCRM;
                u.hasHMS = token.hasHMS;
                u.dbUrl = token.dbUrl;
                u.current_branch_id = token.current_branch_id;
                u.current_branch_name = token.current_branch_name;
            }
            return session;
        }
    }
});
