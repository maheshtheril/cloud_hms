
import { prisma } from "../src/lib/prisma";

async function main() {
    // Defines the host we are targeting (Render production)
    const host = "cloud-hms.onrender.com";
    console.log(`Updating branding for host: ${host}`);

    // Find the tenant by domain or slug
    let tenant = await prisma.tenant.findFirst({
        where: {
            OR: [
                { domain: host },
                { slug: host.split('.')[0] }
            ]
        }
    });

    // Fallback: If no exact match, grab the first created tenant (common in single-tenant setups)
    if (!tenant) {
        console.log("No exact match, updating the fallback (first created) tenant.");
        tenant = await prisma.tenant.findFirst({
            orderBy: { created_at: 'asc' }
        });
    }

    if (tenant) {
        console.log("Found Tenant:", tenant.name, tenant.id);

        // Update with professional branding
        await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
                app_name: 'Cloud HMS Enterprise',
                logo_url: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png'
            }
        });
        console.log("Branding Updated Successfully! Logo and Name set.");
    } else {
        console.error("No tenant found to update!");
    }
}

main();
