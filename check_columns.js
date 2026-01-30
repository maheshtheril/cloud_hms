const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

client.connect()
    .then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'app_user' ORDER BY ordinal_position"))
    .then(res => {
        console.log('Columns in app_user table:');
        res.rows.forEach(r => console.log('  -', r.column_name));
        client.end();
    })
    .catch(err => {
        console.error('Error:', err.message);
        client.end();
    });
