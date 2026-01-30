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
    'modules',
    'tenant_module',
    'role',
    'user_branch',
    'user_permission',
    'permission',
    'user_role',
    'hms_user_roles'
];

async function fixTimestamps() {
    try {
        await client.connect();
        console.log('Connected to database');

        for (const table of tables) {
            console.log(`Checking table: ${table}`);

            // Add created_at
            try {
                await client.query(`
                    ALTER TABLE "${table}" 
                    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
                `);
                console.log(`  - Checked/Added created_at to ${table}`);
            } catch (e) {
                console.log(`  - Error checking created_at for ${table}: ${e.message}`);
            }

            // Add updated_at (if not permission/user_branch/user_permission which might not need it? But safe to add)
            // Schema checks: 
            // - modules: Has updated_at
            // - tenant_module: Has updated_at
            // - role: Schema DOES NOT have updated_at (Line 4224). So skip for `role`.
            // - user_branch: Schema DOES NOT have updated_at.
            // - user_permission: Schema DOES NOT have updated_at.
            // - permission: Schema DOES NOT have updated_at.

            if (['modules', 'tenant_module'].includes(table)) {
                try {
                    await client.query(`
                        ALTER TABLE "${table}" 
                        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
                    `);
                    console.log(`  - Checked/Added updated_at to ${table}`);
                } catch (e) {
                    console.log(`  - Error checking updated_at for ${table}: ${e.message}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Global Error:', error);
    } finally {
        await client.end();
    }
}

fixTimestamps();
