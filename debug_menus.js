const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function debugMenus() {
    try {
        await client.connect();

        console.log('--- Checking Modules Table for Duplicates ---');
        const mods = await client.query('SELECT module_key, count(*) FROM modules GROUP BY module_key HAVING count(*) > 1');
        if (mods.rows.length > 0) {
            console.log('⚠️ DUPLICATES FOUND IN MODULES TABLE:');
            mods.rows.forEach(r => console.log(`${r.module_key}: ${r.count} copies`));
        } else {
            console.log('✅ No duplicates in modules table keys.');
        }

        // Check Tenant Modules
        const tenantRes = await client.query('SELECT id, name FROM tenant ORDER BY created_at DESC LIMIT 1');
        if (tenantRes.rows.length > 0) {
            const t = tenantRes.rows[0];
            console.log(`\n--- Latest Tenant: ${t.name} ---`);

            const tmRes = await client.query(`
                SELECT module_key, count(*) 
                FROM tenant_module 
                WHERE tenant_id = $1
                GROUP BY module_key 
                HAVING count(*) > 1
            `, [t.id]);

            if (tmRes.rows.length > 0) {
                console.log('⚠️ DUPLICATES FOUND IN TENANT_MODULE:');
                tmRes.rows.forEach(r => console.log(`${r.module_key}: ${r.count} copies`));
            } else {
                console.log('✅ No duplicates in tenant_module.');
            }

            // List all active menus/modules
            const all = await client.query(`
                SELECT tm.module_key
                FROM tenant_module tm
                WHERE tm.tenant_id = $1
            `, [t.id]);
            console.log('\nActive Modules for Tenant:', all.rows.map(r => r.module_key).join(', '));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

debugMenus();
