const { Client } = require('pg');
const fs = require('fs');

async function downloadBackup() {
    const connectionString = "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
    const client = new Client({ connectionString });

    try {
        console.log("Connecting to ionahms on Neon...");
        await client.connect();

        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

        let sqlOutput = "-- IONA HMS BACKUP\n-- Generated on: " + new Date().toISOString() + "\n\n";

        for (let row of tables.rows) {
            const tableName = row.table_name;
            console.log(`Extracting ${tableName}...`);

            const data = await client.query(`SELECT * FROM "${tableName}"`);

            if (data.rows.length > 0) {
                sqlOutput += `\n-- Data for table ${tableName}\n`;
                // Basic insert generator for backup
                data.rows.forEach(r => {
                    const keys = Object.keys(r).join(', ');
                    const values = Object.values(r).map(v => v === null ? 'NULL' : `'${v.toString().replace(/'/g, "''")}'`).join(', ');
                    sqlOutput += `INSERT INTO "${tableName}" (${keys}) VALUES (${values});\n`;
                });
            }
        }

        fs.writeFileSync('ionahms_backup.sql', sqlOutput);
        console.log("✅ SUCCESS! Your backup is ready: ionahms_backup.sql");

    } catch (err) {
        console.error("❌ FAILED:", err.message);
    } finally {
        await client.end();
    }
}

downloadBackup();
