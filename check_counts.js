const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function checkCounts() {
    try {
        await client.connect();
        const tables = ['app_user', 'role', 'permissions', 'modules', 'tenant_module', 'countries'];
        for (const t of tables) {
            try {
                const res = await client.query(`SELECT COUNT(*) FROM "${t}"`);
                console.log(`${t}: ${res.rows[0].count}`);
            } catch (e) {
                console.log(`${t}: Error ${e.message}`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
checkCounts();
