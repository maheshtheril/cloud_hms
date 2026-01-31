const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function audit() {
    try {
        await client.connect();

        console.log('--- USER AUDIT ---');
        const users = await client.query("SELECT id, name, email, tenant_id FROM app_user WHERE email ILIKE '%mahesh%'");
        users.rows.forEach(u => console.log(`User: ${u.name} | Email: ${u.email} | Tenant: ${u.tenant_id}`));

        if (users.rows.length === 0) {
            console.log('No Mahesh found. Checking all users...');
            const allUsers = await client.query("SELECT email, tenant_id FROM app_user LIMIT 5");
            allUsers.rows.forEach(u => console.log(`User: ${u.email} | Tenant: ${u.tenant_id}`));
        }

        const tenantIds = users.rows.map(u => u.tenant_id);

        console.log('\n--- PIPELINE AUDIT ---');
        const pipelines = await client.query("SELECT id, name, tenant_id FROM crm_pipelines WHERE deleted_at IS NULL");
        pipelines.rows.forEach(p => {
            const isMaheshTenant = tenantIds.includes(p.tenant_id);
            console.log(`Pipeline: ${p.name} | Tenant: ${p.tenant_id} | Matches Mahesh? ${isMaheshTenant}`);
        });

        console.log('\n--- MENU AUDIT ---');
        const menus = await client.query("SELECT key, label, url FROM menu_items WHERE module_key = 'crm' AND parent_id IS NULL");
        menus.rows.forEach(m => console.log(`Menu: ${m.label} | Key: ${m.key} | URL: ${m.url}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
audit();
