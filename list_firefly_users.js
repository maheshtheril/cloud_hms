const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
    host: '13.228.46.236', user: 'neondb_owner', password: 'npg_LKIg3tRXfbp9', database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});
async function c() {
    await client.connect();
    const r = await client.query("SELECT email, tenant_id FROM app_user");
    let out = r.rows.map(u => `${u.email} | ${u.tenant_id}`).join('\n');
    fs.writeFileSync('firefly_users.txt', out);
    await client.end();
}
c();
