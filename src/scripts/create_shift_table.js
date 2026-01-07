
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL not found");
        return;
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const sql = `
    CREATE TABLE IF NOT EXISTS "hms_cash_shift" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" UUID NOT NULL,
        "company_id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "end_time" TIMESTAMPTZ(6),
        "opening_balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
        "closing_balance" DECIMAL(18,2),
        "system_balance" DECIMAL(18,2),
        "difference" DECIMAL(18,2),
        "status" TEXT NOT NULL DEFAULT 'open',
        "notes" TEXT,
        "denominations" JSONB DEFAULT '{}',
        "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "hms_cash_shift_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "idx_hms_cash_shift_user_status" ON "hms_cash_shift"("user_id", "status");
    CREATE INDEX IF NOT EXISTS "idx_hms_cash_shift_tenant" ON "hms_cash_shift"("tenant_id");
  `;

    try {
        await prisma.$executeRawUnsafe(sql);
        console.log("SQL_SUCCESS");
    } catch (e) {
        console.error("SQL_FAILED", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
