import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.modules.upsert({
            where: { module_key: 'reports' },
            update: {
                name: 'Reports & Analytics',
                is_active: true,
                description: 'Comprehensive reporting and analytics suite'
            },
            create: {
                module_key: 'reports',
                name: 'Reports & Analytics',
                is_active: true,
                description: 'Comprehensive reporting and analytics suite'
            }
        });
        console.log('✅ Reports module ensured.');
    } catch (e) {
        console.error('Error seeding reports module:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
