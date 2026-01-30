
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
        }
    }
});

async function main() {
    console.log('Testing findFirst check...');
    try {
        const user = await prisma.app_user.findFirst({
            where: { email: 'test@example.com' }
        });
        console.log('Success! Result:', user);
    } catch (error) {
        console.error('FAILED Query:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
