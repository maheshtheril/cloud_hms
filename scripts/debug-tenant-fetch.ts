
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Checking Tenants...");
    const tenants = await prisma.tenant.findMany({
        select: { id: true, name: true, slug: true, domain: true, app_name: true, logo_url: true }
    });
    console.table(tenants);

    // Simulate host check
    const host = "cloud-hms.onrender.com";
    console.log(`Checking for host: ${host}`);

    let tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { domain: host },
                { slug: host.split('.')[0] }
            ]
        }
    });

    console.log("Found by Host/Slug?", tenant);

    if (!tenant) {
        console.log("Falling back to first tenant...");
        tenant = await prisma.tenant.findFirst({
            orderBy: { created_at: 'asc' }
        });
        console.log("Fallback Tenant:", tenant);
    }
}

main();
