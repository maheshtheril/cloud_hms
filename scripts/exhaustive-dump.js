
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_invoice_history'];

    for (const table of tables) {
        console.log(`--- ${table} ---`);
        const res = await client.query(`
        SELECT column_name, data_type, udt_name, column_default 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY column_name
      `, [table]);

        res.rows.forEach(col => {
            console.log(`${col.column_name}: Type=${col.udt_name}, Default=${col.column_default}`);
        });
    }

    await client.end();
}

main();
