const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

async function addMissingColumns() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Check what columns exist
        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'app_user'
            ORDER BY ordinal_position;
        `);

        console.log('Current app_user columns:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type}`);
        });

        // Add missing columns if they don't exist
        const columnsToAdd = [
            { name: 'full_name', type: 'TEXT' },
            { name: 'role', type: 'TEXT' },
            { name: 'is_platform_admin', type: 'BOOLEAN DEFAULT false' },
            { name: 'is_tenant_admin', type: 'BOOLEAN DEFAULT false' },
            { name: 'current_branch_id', type: 'UUID' }
        ];

        for (const col of columnsToAdd) {
            try {
                await client.query(`
                    ALTER TABLE app_user 
                    ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
                `);
                console.log(`✅ Added column: ${col.name}`);
            } catch (e) {
                console.log(`⚠️  Column ${col.name} might already exist:`, e.message);
            }
        }

        console.log('\n✅ All columns added successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

addMissingColumns();
