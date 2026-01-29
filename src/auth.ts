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
                        SELECT id, email, name, is_admin, is_tenant_admin, tenant_id, company_id, current_branch_id, password, role, metadata
                        FROM app_user
                        WHERE LOWER(email) = ${email}
                          AND is_active = true
                          AND password = crypt(${credentials.password}, password)
                    ` as any[];

                    if (users && users.length > 0) {
                        let user = users[0];

                        try {
                            // SELF-HEALING: If Company/Tenant is missing or incomplete
                            if (!user.company_id && user.tenant_id) {
                                console.log(`[AUTH] User ${user.email} missing company. Attempting self-repair...`);

                                // 1. Check if ANY company exists for this tenant
                                let defaultCompany = await prisma.company.findFirst({
                                    where: { tenant_id: user.tenant_id }
                                });

                                // 2. If not, create one
                                if (!defaultCompany) {
                                    console.log("[AUTH] Creating default company...");
                                    defaultCompany = await prisma.company.create({
                                        data: {
                                            tenant_id: user.tenant_id,
                                            name: "Seeakk Hospital",  // Default Name
                                            industry: "Healthcare"
                                        }
                                    });
                                }

                                // 3. Link user to company
                                console.log(`[AUTH] Linking user to company ${defaultCompany.id}`);
                                await prisma.app_user.update({
                                    where: { id: user.id },
                                    data: { company_id: defaultCompany.id }
                                });

                                // 4. Update local user object so session is correct immediately
                                user.company_id = defaultCompany.id;
                            }

                            // Fetch Company & Modules
                            const company = user.company_id ? await prisma.company.findFirst({ where: { id: user.company_id } }) : null;
                            const tenantInfo = await prisma.tenant.findUnique({
                                where: { id: user.tenant_id },
                                select: { db_url: true }
                            });
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
                                role: user.role,
                                isAdmin: user.is_admin,
                                isTenantAdmin: user.is_tenant_admin,
                                tenantId: user.tenant_id,
                                companyId: user.company_id,
                                companyName: company ? company.name : 'Unknown Company',
                                branchId: user.current_branch_id,
                                modules: moduleKeys, // Array of enabled module keys
                                image: safeImage,
                                dbUrl: tenantInfo?.db_url, // Important for Tenant Routing

                                // Fix for TS Error: Add missing fields
                                industry: company?.industry || 'Healthcare',
                                hasCRM: moduleKeys.includes('crm'),
                                hasHMS: moduleKeys.includes('hms')
                            };
                        } catch (innerError) {
                            console.error("Error fetching user details (company/tenant):", innerError);
                            // Fallback if metadata fetch fails? 
                            // Usually strict fail is better for security, but we can log it.
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
});
