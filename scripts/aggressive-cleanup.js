
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('AGGRESSIVE PHANTOM COLUMN REMOVAL STARTING...');

    const res = await client.query(`
    SELECT table_name, column_name, udt_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
  `);

    const whitelist = [
        'working_days',
        'tags',
        'permissions',
        'analytic_tag_ids',
        'journal_entry_line_ids',
        'work_days',
        'allowed_days',
        'period_ids',
        'allowed_clinicians',
        'allowed_branches'
    ];

    const toDrop = [];
    res.rows.forEach(col => {
        // Whitelist bypass
        if (whitelist.includes(col.column_name)) return;
        if (col.column_name.endsWith('_ids')) return;
        if (col.column_name.endsWith('_keys')) return;
        if (col.column_name.endsWith('_tags')) return;

        // If it's an array and its name looks like a table or a relation
        // In this DB, almost ALL other arrays are phantoms
        toDrop.push(col);
    });

    console.log(`Found ${toDrop.length} candidates to drop.`);

    try {
        await client.query('BEGIN');
        for (const col of toDrop) {
            console.log(`Dropping ${col.table_name}.${col.column_name}...`);
            try {
                await client.query(`ALTER TABLE "${col.table_name}" DROP COLUMN "${col.column_name}" CASCADE`);
            } catch (e) {
                console.log(`Failed to drop ${col.table_name}.${col.column_name}: ${e.message}`);
            }
        }
        await client.query('COMMIT');
        console.log('Aggressive cleanup complete.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('FATAL ERROR:', err);
    }

    await client.end();
}

main();
