import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
    console.log("--- DB SCHEMA CHECK (hms_settings) ---");

    const columns = await prisma.$queryRaw`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'hms_settings'
  `;

    console.log(JSON.stringify(columns, null, 2));

    await prisma.$disconnect();
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
