const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function find() {
    try {
        await client.connect();
        const users = await client.query("SELECT email, tenant_id FROM app_user WHERE email ILIKE '%mahesh%'");
        console.log('--- USERS ---');
        users.rows.forEach(u => console.log(`${u.email} -> ${u.tenant_id}`));

        if (users.rows[0]) {
            const tid = users.rows[0].tenant_id;
            const pipes = await client.query("SELECT name FROM crm_pipelines WHERE tenant_id = $1", [tid]);
            console.log(`\nPipelines for ${tid}: ${pipes.rows.length}`);
            pipes.rows.forEach(p => console.log(`- ${p.name}`));
        }

        const menus = await client.query("SELECT key, label FROM menu_items WHERE module_key = 'crm'");
        console.log('\n--- CRM MENUS ---');
        menus.rows.forEach(m => console.log(`${m.key}: ${m.label}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
find();
