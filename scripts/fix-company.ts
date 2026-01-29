
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🏥 ENSURING COMPANY & FIXING USER...");

    const email = "admin@seeakk.com";
    const slug = "seeakk";

    try {
        // 1. Get Tenant
        const tenant = await prisma.tenant.findFirst({ where: { slug: slug } });
        if (!tenant) {
            console.error("❌ CRITICAL: Tenant 'seeakk' not found.");
            return;
        }

        // 2. Ensure Company Exists
        let company = await prisma.company.findFirst({ where: { tenant_id: tenant.id } });
        if (!company) {
            console.log("Creating Company for Seeakk...");
            company = await prisma.company.create({
                data: {
                    tenant_id: tenant.id,
                    name: "Seeakk Hospital", // Or Solutions
                    industry: "Healthcare",
                    // Add other required fields if any (usually email/phone are optional)
                }
            });
            console.log(`✅ Company Created: ${company.id}`);
        } else {
            console.log(`✅ Company Exists: ${company.id}`);
        }

        // 3. Update Admin User to link to this Company
        console.log("Linking User to Company...");
        await prisma.app_user.updateMany({
            where: { email: email },
            data: {
                company_id: company.id,
                tenant_id: tenant.id // Ensure this matches too
            }
        });

        console.log("✅ User updated with Company ID.");

    } catch (e) {
        console.error("💥 Error:", e);
    }
}

main().finally(() => prisma.$disconnect());
