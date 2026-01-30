const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function run() {
    try {
        await client.connect();

        // 1. Rename 'Deals' to 'Sales Pipeline' or 'Deals Pipeline'
        console.log('Renaming Deal menu...');
        await client.query(`UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'`);

        // 2. Remove the extra 'Pipeline' menu item (it's now merged)
        console.log('Removing redundant Pipeline menu...');
        await client.query(`DELETE FROM menu_items WHERE key = 'crm-pipeline'`);

        console.log('✅ Menu Consolidated.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
