const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

async function fixTenantModule() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Add updated_at to tenant_module
        await client.query(`
            ALTER TABLE tenant_module 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `);
        console.log('✅ Added updated_at to tenant_module');

        // Check if created_at exists too
        await client.query(`
            ALTER TABLE tenant_module 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `);
        console.log('✅ Added created_at to tenant_module');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

fixTenantModule();
