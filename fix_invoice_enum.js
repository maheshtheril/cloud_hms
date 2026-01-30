const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function fixEnum() {
    try {
        await client.connect();

        console.log('Fixing hms_invoice_status enum...');

        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hms_invoice_status') THEN
                    CREATE TYPE hms_invoice_status AS ENUM ('draft', 'posted', 'paid', 'cancelled', 'void');
                END IF;
            END $$;
        `);

        // Alter column (handle existing defaults if any?)
        // We drop default first to be safe, then add it back?
        // Or just alter.
        // Default is 'draft' (text). We need default 'draft'::hms_invoice_status.

        await client.query(`
            ALTER TABLE hms_invoice 
            ALTER COLUMN status DROP DEFAULT;
        `);

        await client.query(`
            ALTER TABLE hms_invoice 
            ALTER COLUMN status TYPE hms_invoice_status 
            USING status::hms_invoice_status;
        `);

        await client.query(`
            ALTER TABLE hms_invoice 
            ALTER COLUMN status SET DEFAULT 'draft'::hms_invoice_status;
        `);

        console.log('✅ Fixed hms_invoice_status');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

fixEnum();
