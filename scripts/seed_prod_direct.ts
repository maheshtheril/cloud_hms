import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const sqlPath = path.join(process.cwd(), 'prisma', 'seed_global.sql');

// Prod "Tiny Lab" Credentials (IP + SNI for reliability)
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

async function main() {
    console.log("Reading SQL file...");
    let sql = '';
    try {
        sql = fs.readFileSync(sqlPath, 'utf-8');
    } catch (e) {
        console.error("Could not read seed_global.sql");
        process.exit(1);
    }

    console.log("Connecting to PROD (Tiny Lab) DB...");
    const client = new Client(dbConfig);

    try {
        await client.connect();

        // Ensure defaults one last time just in case
        try { await client.query(`ALTER TABLE country_subdivision ALTER COLUMN id SET DEFAULT gen_random_uuid()`); } catch (e) { }

        console.log("Connected. Executing Seed...");

        // Execute the whole file
        await client.query(sql);

        console.log("✅ Seed applied successfully to PROD!");
    } catch (e) {
        console.error("Seed execution failed:");
        // Print less of the error to avoid buffer limits if it's huge
        const err = e as any;
        console.error(err.message);
        if (err.detail) console.error("Detail:", err.detail);
        if (err.hint) console.error("Hint:", err.hint);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
