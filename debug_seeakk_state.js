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

        // 1. Check duplicate menus
        console.log('--- RELEVANT MENU ITEMS ---');
        const menus = await client.query("SELECT id, key, label, url, module_key FROM menu_items WHERE module_key = 'crm' OR label ILIKE '%pipeline%' OR label ILIKE '%deals%'");
        menus.rows.forEach(m => console.log(`ID: ${m.id} | Key: ${m.key} | Label: ${m.label} | URL: ${m.url}`));

        // 2. Check Pipelines
        console.log('\n--- PIPELINES ---');
        const pipelines = await client.query("SELECT id, name, tenant_id FROM crm_pipelines WHERE deleted_at IS NULL");
        console.log(`Found ${pipelines.rows.length} total pipelines in DB.`);
        pipelines.rows.slice(0, 5).forEach(p => console.log(`ID: ${p.id} | Name: ${p.name} | Tenant: ${p.tenant_id}`));

        // 3. Get User/Tenant Info (to see what we should be filtering by)
        console.log('\n--- RECENT USERS ---');
        const users = await client.query("SELECT id, name, email, tenant_id FROM app_user ORDER BY created_at DESC LIMIT 3");
        users.rows.forEach(u => console.log(`User: ${u.name} | Email: ${u.email} | Tenant: ${u.tenant_id}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
debug();
