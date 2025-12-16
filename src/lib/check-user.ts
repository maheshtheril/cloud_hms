import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
    try {
        const users = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 1,
            select: { id: true, email: true, created_at: true, tenant_id: true }
        });
        console.log('Most Recent User:', JSON.stringify(users, null, 2));

        const tenants = await prisma.tenant.findMany({
            orderBy: { created_at: 'desc' },
            take: 1,
            select: { id: true, name: true, created_at: true }
        });
        console.log('Most Recent Tenant:', JSON.stringify(tenants, null, 2));

    } catch (e) {
        console.error(e);
    }
}

main();
