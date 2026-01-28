
import { prisma } from "../src/lib/prisma";

async function main() {
    const args = process.argv.slice(2);
    const hostToCheck = args[0] || 'localhost';

    console.log(`\n🔍 Simulating Request for Host: "${hostToCheck}"`);
    console.log(`-----------------------------------------------`);

    // Extract slug (e.g., 'apollo' from 'apollo.cloud-hms.com')
    const slug = hostToCheck.split('.')[0];
    console.log(`👉 Extracted Slug: "${slug}"`);

    // 1. Attempt exact lookup
    console.log(`\n1️⃣  Checking Database for tenant with:`);
    console.log(`    - Domain: "${hostToCheck}"`);
    console.log(`    - OR Slug: "${slug}"`);

    const tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { domain: hostToCheck },
                { slug: slug }
            ]
        },
        select: { name: true, app_name: true, slug: true, logo_url: true }
    });

    if (tenant) {
        console.log(`\n✅ MATCH FOUND!`);
        console.log(`   Tenant Name: ${tenant.name}`);
        console.log(`   App Name:    ${tenant.app_name}`);
        console.log(`   Slug:        ${tenant.slug}`);
        console.log(`   Logo URL:    ${tenant.logo_url || '(None)'}`);
        console.log(`\n   Result: Login screen WILL show this tenant's branding.`);
    } else {
        console.log(`\n❌ NO EXACT MATCH.`);
        console.log(`   The system will fall back to the newest tenant (System Default).`);
    }
    console.log(`\n-----------------------------------------------`);
}

main();
