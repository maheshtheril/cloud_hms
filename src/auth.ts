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
                    const email = (credentials.email as string || '').toLowerCase()

                    console.log("[AUTH] Authorizing user:", email);

                    // Use standard Prisma findFirst for better compatibility with extensions
                    console.log("[AUTH] Attempting login for:", email);
                    const user = await prisma.app_user.findFirst({
                        where: {
                            email: email,
                            is_active: true
                        }
                    }) as any;

                    console.log("[AUTH] User found in DB:", user ? "YES" : "NO");

                    if (user) {
                        console.log("[AUTH] Comparing passwords...");
                        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
                        console.log("[AUTH] Passwords match:", passwordsMatch);
                        if (!passwordsMatch) return null;

                        try {
                            // 1. Fetch Branch Name (Optional)
                            let branchName = 'Main Branch';
                            if (user.current_branch_id) {
                                try {
                                    const branch = await prisma.hms_branch.findUnique({
                                        where: { id: user.current_branch_id },
                                        select: { name: true }
                                    });
                                    if (branch) branchName = branch.name;
                                } catch (e) {
                                    console.warn("[AUTH] Failed to fetch branch name:", e);
                                }
                            }

                            // 2. Self-Healing for missing company_id
                            if (user.tenant_id && !user.company_id) {
                                try {
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
                                } catch (e) {
                                    console.error("[AUTH] Self-healing failed:", e);
                                }
                            }

                            // 3. Fetch Tenant & Company Details (Granular)
                            let tenantInfo = null;
                            if (user.tenant_id) {
                                try {
                                    tenantInfo = await prisma.tenant.findUnique({
                                        where: { id: user.tenant_id },
                                        select: { db_url: true, slug: true, name: true }
                                    });
                                } catch (e) {
                                    console.error("[AUTH] Tenant fetch failed:", e);
                                }
                            }

                            let company = null;
                            if (user.company_id) {
                                try {
                                    company = await prisma.company.findFirst({
                                        where: { id: user.company_id },
                                        include: {
                                            company_settings: {
                                                include: {
                                                    currencies: true
                                                }
                                            }
                                        }
                                    });
                                } catch (e) {
                                    console.error("[AUTH] Company fetch failed:", e);
                                }
                            }

                            // 4. Modules
                            let moduleKeys: string[] = [];
                            try {
                                const tenantModules = await prisma.tenant_module.findMany({
                                    where: { tenant_id: user.tenant_id, enabled: true },
                                    select: { module_key: true }
                                });
                                moduleKeys = tenantModules.map(m => m.module_key);
                            } catch (e) {
                                console.error("[AUTH] Module fetch failed:", e);
                            }

                            if (tenantInfo?.slug === 'seeakk') {
                                moduleKeys = ['crm'];
                            }

                            // 5. Avatar
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
                                companyName: company?.name || tenantInfo?.name || 'My Business',
                                current_branch_id: user.current_branch_id,
                                current_branch_name: branchName,
                                modules: moduleKeys,
                                image: safeImage,
                                dbUrl: tenantInfo?.db_url,
                                currencyCode: company?.company_settings?.currencies?.code || 'INR',
                                currencySymbol: company?.company_settings?.currencies?.symbol || '₹',
                                industry: company?.industry || 'General',
                                hasCRM: moduleKeys.includes('crm'),
                                hasHMS: moduleKeys.includes('hms')
                            };
                        } catch (err) {
                            console.error("[AUTH] Enrichment error:", err);
                            // Fallback to basic user if enhancement fails completely
                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                role: user.role,
                                tenantId: user.tenant_id,
                                companyId: user.company_id,
                                modules: [],
                                currencyCode: 'INR',
                                currencySymbol: '₹'
                            } as any;
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
                token.currencyCode = u.currencyCode;
                token.currencySymbol = u.currencySymbol;
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
                u.currencyCode = token.currencyCode;
                u.currencySymbol = token.currencySymbol;
            }
            return session;
        }
    }
});
