
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function inspect() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_patient'];

        for (const table of tables) {
            console.log(`\n=== INSPECTING TABLE: ${table} ===`);

            // Get columns, types, nullability
            const res = await client.query(`
                SELECT 
                    column_name, 
                    data_type, 
                    is_nullable, 
                    column_default
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY is_nullable ASC, column_name ASC
            `, [table]);

            console.table(res.rows);

            // Get Constraints (Foreign Keys, Uniques, Checks)
            console.log(`\n--- CONSTRAINTS for ${table} ---`);
            const conRes = await client.query(`
                SELECT
                    conname as constraint_name,
                    contype as constraint_type,
                    pg_get_constraintdef(c.oid) as definition
                FROM pg_constraint c
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE conrelid = $1::regclass
            `, [table]);
            console.table(conRes.rows);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
