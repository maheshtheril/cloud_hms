const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function fix() {
    try {
        await client.connect();

        // 1. Delete the redundant Pipeline menu item
        console.log('--- CLEANING MENUS ---');
        const delRes = await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        console.log(`Deleted ${delRes.rowCount} 'crm-pipeline' menu items.`);

        // 2. Ensure crm-deals is named correctly
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'");

        // 3. Find Mahesh
        const maheshRes = await client.query("SELECT tenant_id, email FROM app_user WHERE email ILIKE '%mahesh%'");
        console.log(`\nFound ${maheshRes.rows.length} Mahesh users.`);

        for (const u of maheshRes.rows) {
            console.log(`\nChecking Tenant: ${u.tenant_id} (${u.email})`);
            const pipes = await client.query("SELECT id, name, deleted_at FROM crm_pipelines WHERE tenant_id = $1", [u.tenant_id]);
            console.log(`Existing pipelines: ${pipes.rows.length}`);
            pipes.rows.forEach(p => console.log(`- ${p.name} (Deleted at: ${p.deleted_at})`));

            if (pipes.rows.length === 0) {
                console.log('Seeding pipeline...');
                // ... same seed logic as before ...
            } else {
                // Undelete if deleted
                await client.query("UPDATE crm_pipelines SET deleted_at = NULL WHERE tenant_id = $1", [u.tenant_id]);
                console.log('Undeleted existing pipelines.');
            }
        }

        console.log('\n--- FINAL AUDIT ---');
        const remaining = await client.query("SELECT key, label FROM menu_items WHERE module_key = 'crm'");
        remaining.rows.forEach(r => console.log(`- ${r.key}: ${r.label}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
fix();
