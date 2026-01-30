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

const tables = [
    'tenant', 'app_user', 'role', 'user_role', 'user_branch', 'permissions', 'user_permission', 'modules', 'tenant_module'
];

async function audit() {
    try {
        await client.connect();

        for (const table of tables) {
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position
            `, [table]);

            console.log(`\n=== Table: ${table} ===`);
            res.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
        }

    } catch (error) {
        console.error(error);
    } finally {
        await client.end();
    }
}

audit();
