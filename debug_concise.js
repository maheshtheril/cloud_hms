const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function debug() {
    try {
        await client.connect();

        const menus = await client.query("SELECT key, label FROM menu_items WHERE label ILIKE '%pipeline%' OR label ILIKE '%deals%'");
        console.log('--- MENUS ---');
        menus.rows.forEach(m => console.log(`${m.key}: ${m.label}`));

        const pipelines = await client.query("SELECT name, tenant_id FROM crm_pipelines LIMIT 5");
        console.log('\n--- PIPELINES ---');
        pipelines.rows.forEach(p => console.log(`${p.name} (Tenant: ${p.tenant_id})`));

        const user = await client.query("SELECT tenant_id FROM app_user WHERE email ILIKE '%mahesh%' LIMIT 1");
        if (user.rows[0]) console.log(`\nMahesh Tenant ID: ${user.rows[0].tenant_id}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
debug();
