import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("--- Checking Indexes on hms_stock_levels ---")
    const indexes: any = await prisma.$queryRaw`
    SELECT
        t.relname as table_name,
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique
    FROM
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a
    WHERE
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relname = 'hms_stock_levels'
    ORDER BY
        t.relname,
        i.relname;
  `
    console.table(indexes)

    console.log("\n--- Checking Row Count ---")
    const count = await prisma.hms_stock_levels.count()
    console.log("Total Rows in hms_stock_levels:", count)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
