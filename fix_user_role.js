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

async function fixUserRole() {
    try {
        await client.connect();
        console.log('Connected to database');

        await client.query(`
            ALTER TABLE user_role 
            ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `);
        console.log('✅ Added assigned_at column to user_role');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

fixUserRole();
