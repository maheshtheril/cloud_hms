import { prisma } from './src/lib/prisma';

async function run() {
    try {
        console.log("Fetching recently created users from the connected database...");
        const users = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 5,
            select: { email: true, created_at: true, company: { select: { name: true } } }
        });

        console.log("Recent users found:", JSON.stringify(users, null, 2));
    } catch (e) {
        console.error("Failed to fetch users:", e);
    }
}

run();
