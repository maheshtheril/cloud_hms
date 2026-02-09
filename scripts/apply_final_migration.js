const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log('✓ Connected to database');

        // Read the migration file
        const migrationSQL = fs.readFileSync(
            'prisma/migrations/20260209_final_schema_cleanup/migration.sql',
            'utf8'
        );

        console.log('✓ Loaded migration file');
        console.log('⚠ This will remove all phantom array columns from the database');
        console.log('⚠ Starting migration in 2 seconds...');

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('→ Executing migration...');
        await client.query(migrationSQL);

        console.log('✓ Migration completed successfully!');

        // Verify
        const result = await client.query(`
            SELECT COUNT(*) as phantom_count
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND (data_type = 'ARRAY' OR udt_name LIKE '_%')
            AND NOT (
                (table_name = 'hms_clinicians' AND column_name = 'working_days') OR
                (table_name = 'role' AND column_name = 'permissions')
            )
        `);

        const phantomCount = parseInt(result.rows[0].phantom_count);
        if (phantomCount === 0) {
            console.log('✓ SUCCESS: All phantom array columns removed!');
            console.log('✓ Database schema is now production-ready');
        } else {
            console.log(`⚠ WARNING: ${phantomCount} phantom columns still remain`);
        }

    } catch (err) {
        console.error('✗ Migration failed:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
