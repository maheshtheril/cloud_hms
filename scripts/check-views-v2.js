
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const views = ['invoices', 'vw_hms_invoice_finance', 'v_hms_invoice_status', 'v_hms_invoice_summary'];
    for (const v of views) {
        const res = await client.query(`SELECT to_regclass($1) as exists`, [v]);
        console.log(`View ${v}: ${res.rows[0].exists ? 'EXISTS' : 'MISSING'}`);
    }
    await client.end();
}

main();
