const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
    host: '13.228.184.177', user: 'neondb_owner', password: 'npg_t3GQCEaDsY5M', database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});
async function c() {
    await client.connect();
    const r = await client.query("SELECT email FROM app_user WHERE email ILIKE 'sari%'");
    fs.writeFileSync('sari_users.txt', r.rows.map(u => u.email).join('\n'));
    await client.end();
}
c();
