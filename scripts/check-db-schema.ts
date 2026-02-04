import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

async function check() {
  console.log("--- DB SCHEMA CHECK (hms_settings) ---");
  console.log("DB URL (partial):", process.env.DATABASE_URL?.slice(0, 20) + "...");

  try {
    const columns: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'hms_settings'
    `;

    console.log("Columns found:", columns.length);
    console.table(columns);

    const constraints: any[] = await prisma.$queryRaw`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'hms_settings'::regclass
    `;
    console.log("\nConstraints:");
    console.table(constraints);

  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});
