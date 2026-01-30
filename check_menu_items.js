const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function checkMenuItems() {
    try {
        await client.connect();

        console.log('--- Checking menu_items Table for Duplicates ---');

        const res = await client.query(`
            SELECT key, count(*) as count
            FROM menu_items 
            GROUP BY key 
            HAVING count(*) > 1
        `);

        if (res.rows.length > 0) {
            console.log(`⚠️ FOUND ${res.rows.length} DUPLICATE MENU KEYS!`);
            res.rows.slice(0, 5).forEach(r => console.log(`${r.key}: ${r.count} copies`));
        } else {
            console.log('✅ No duplicates in menu_items.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

checkMenuItems();
