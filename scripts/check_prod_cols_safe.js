const { Client } = require('pg');

const dbConfig = {
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech'
    },
};

const client = new Client(dbConfig);

async function main() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'countries';
        `);
        console.log("Countries Columns:");
        res.rows.forEach(r => console.log(`- ${r.column_name} (${r.data_type}, ${r.character_maximum_length})`));

        // Also check if 'id' has default
        const defRes = await client.query(`
            SELECT column_default 
            FROM information_schema.columns 
            WHERE table_name = 'countries' AND column_name = 'id';
        `);
        console.log("ID Default:", defRes.rows[0]?.column_default);

    } catch (e) { console.error(e); }
    finally { client.end(); }
}
main();
