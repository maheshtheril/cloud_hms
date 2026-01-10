const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        let [key, ...valueParts] = line.split('=');
        let value = valueParts.join('=');

        if (key && value) {
            key = key.trim();
            value = value.trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    try {
        console.log("Searching for 'Receptionist' role...");

        // Try to find by key or name
        const role = await prisma.role.findFirst({
            where: {
                OR: [
                    { key: { equals: 'receptionist', mode: 'insensitive' } },
                    { name: { equals: 'Receptionist', mode: 'insensitive' } }
                ]
            }
        });

        if (!role) {
            console.log("❌ Role 'Receptionist' not found.");
            return;
        }

        console.log(`✅ Found Role: ${role.name} (ID: ${role.id}, Key: ${role.key})`);

        const permissions = await prisma.role_permission.findMany({
            where: { role_id: role.id },
            select: { permission_code: true, is_granted: true }
        });

        console.log(`\n📋 Permissions (${permissions.length}):`);
        if (permissions.length === 0) {
            console.log("No permissions assigned.");
        } else {
            permissions.forEach(p => {
                console.log(`- ${p.permission_code} [${p.is_granted ? 'GRANTED' : 'DENIED'}]`);
            });
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
