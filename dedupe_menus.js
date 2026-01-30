const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function dedupe() {
    try {
        await client.connect();

        console.log('Fetching duplicates...');
        const res = await client.query(`
            SELECT key, array_agg(id) as ids 
            FROM menu_items 
            GROUP BY key 
            HAVING count(*) > 1
        `);

        console.log(`Found ${res.rows.length} keys with duplicates.`);

        for (const row of res.rows) {
            const ids = row.ids;
            const winner = ids[0];
            const losers = ids.slice(1);

            console.log(`Deduplicating ${row.key}: Keeping ${winner}, Removing ${losers.length} copies.`);

            // 1. Relink Children
            // We need to form IN clause.
            const loserStr = losers.map(id => `'${id}'`).join(',');

            if (loserStr) {
                // Relink children to winner
                await client.query(`
                    UPDATE menu_items 
                    SET parent_id = $1 
                    WHERE parent_id IN (${loserStr})
                `, [winner]);

                // 2. Delete Relational Maps (module_menu_map)
                await client.query(`
                    DELETE FROM module_menu_map 
                    WHERE menu_id IN (${loserStr})
                `);

                // 3. Delete Losers
                await client.query(`
                    DELETE FROM menu_items 
                    WHERE id IN (${loserStr})
                `);
            }
        }

        console.log('✅ Deduplication Complete.');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

dedupe();
