const { Client } = require('pg');
const fs = require('fs');

async function fullBackup() {
    const connectionString = "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
    const client = new Client({ connectionString });

    try {
        console.log("🚀 Starting FULL Backup (Schema + Data)...");
        await client.connect();

        let sqlOutput = `-- FULL HMS BACKUP\n-- Generated: ${new Date().toISOString()}\n\n`;
        sqlOutput += "SET statement_timeout = 0;\nSET lock_timeout = 0;\nSET client_encoding = 'UTF8';\n\n";

        // 1. Get Tables
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

        for (let row of tables.rows) {
            const tableName = row.table_name;
            console.log(`📦 Processing ${tableName}...`);

            // 2. Generate CREATE TABLE (Simplified)
            const cols = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '${tableName}'
        ORDER BY ordinal_position
      `);

            sqlOutput += `\n-- Structure for ${tableName}\nDROP TABLE IF EXISTS "${tableName}" CASCADE;\nCREATE TABLE "${tableName}" (\n`;
            const colDefs = cols.rows.map(c => {
                let def = `  "${c.column_name}" ${c.data_type}`;
                if (c.is_nullable === 'NO') def += ' NOT NULL';
                if (c.column_default) def += ` DEFAULT ${c.column_default}`;
                return def;
            });
            sqlOutput += colDefs.join(',\n') + '\n);\n';

            // 3. Get Data
            const data = await client.query(`SELECT * FROM "${tableName}"`);
            if (data.rows.length > 0) {
                console.log(`  💾 Saving ${data.rows.length} rows...`);
                for (let r of data.rows) {
                    const keys = Object.keys(r).join('", "');
                    const values = Object.values(r).map(v => {
                        if (v === null) return 'NULL';
                        if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
                        return `'${v.toString().replace(/'/g, "''")}'`;
                    }).join(', ');
                    sqlOutput += `INSERT INTO "${tableName}" ("${keys}") VALUES (${values});\n`;
                }
            }
        }

        fs.writeFileSync('FULL_NEON_BACKUP.sql', sqlOutput);
        console.log("\n✅ SUCCESS! File created: FULL_NEON_BACKUP.sql");
        console.log("This file contains BOTH the tables and the data.");

    } catch (err) {
        console.error("❌ FAILED:", err.message);
    } finally {
        await client.end();
    }
}

fullBackup();
