
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND column_default IS NOT NULL
  `);

    const issues = res.rows.filter(col => {
        // Postgres arrays use {}
        // If a column is an array but default contains [], it might be the culprit
        const isArray = col.data_type === 'ARRAY' || col.udt_name.startsWith('_');
        return isArray && col.column_default.includes('[]');
    });

    if (issues.length > 0) {
        console.log('--- COLUMNS WITH INVALID ARRAY DEFAULTS ---');
        issues.forEach(col => {
            console.log(`${col.table_name}.${col.column_name} (${col.udt_name}) DEFAULT: ${col.column_default}`);
        });
    } else {
        console.log('No invalid array defaults found.');
    }

    await client.end();
}

main();
