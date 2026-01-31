const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function findDeletes() {
    try {
        await client.connect();
        const res = await client.query("SELECT id FROM menu_items WHERE key = 'crm-pipeline'");
        if (res.rows.length > 0) {
            const id = res.rows[0].id;
            // Check for children
            const kids = await client.query("SELECT id FROM menu_items WHERE parent_id = $1", [id]);
            console.log(`Children: ${kids.rows.length}`);

            // Check for module map
            const maps = await client.query("SELECT id FROM module_menu_map WHERE menu_item_id = $1", [id]);
            console.log(`Module Maps: ${maps.rows.length}`);

            // Delete maps first
            await client.query("DELETE FROM module_menu_map WHERE menu_item_id = $1", [id]);
            // Delete menu
            await client.query("DELETE FROM menu_items WHERE id = $1", [id]);
            console.log('✅ Deleted crm-pipeline from firefly.');
        } else {
            console.log('Not found on firefly.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
findDeletes();
