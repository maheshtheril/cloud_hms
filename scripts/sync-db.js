const fs = require('fs');
const { Client } = require('pg');

async function sync() {
    // 1. Get database URL from Environment Variables (set by Vercel)
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in environment.');
        return;
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔄 Starting Automatic Database Sync...');

        // 2. Parse schema.prisma
        const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
        const lines = content.split('\n');
        const models = {};
        let currentModel = null;

        for (const line of lines) {
            const trimmed = line.trim();
            const modelMatch = trimmed.match(/^model\s+(\w+)\s+\{/);
            if (modelMatch) { currentModel = modelMatch[1]; models[currentModel] = { fields: [] }; continue; }
            if (trimmed === '}' && currentModel) { currentModel = null; continue; }

            if (currentModel && trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('@@')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    const name = parts[0];
                    let type = parts[1].replace('?', '').replace('[]', '');
                    if (trimmed.includes('@relation')) continue;

                    let sqlType = 'TEXT';
                    if (type === 'Boolean') sqlType = 'BOOLEAN';
                    else if (type === 'Int') sqlType = 'INTEGER';
                    else if (type === 'Decimal') sqlType = 'DECIMAL(20,4)';
                    else if (type === 'DateTime') sqlType = 'TIMESTAMP WITH TIME ZONE';
                    else if (type === 'Json') sqlType = 'JSONB';
                    else sqlType = 'TEXT';

                    if (trimmed.includes('[]')) sqlType += '[]';
                    models[currentModel].fields.push({ name, sqlType, isId: trimmed.includes('@id') });
                }
            }
        }

        // 3. Generate SQL
        let sql = 'BEGIN;\n';
        for (const [modelName, model] of Object.entries(models)) {
            const pkField = model.fields.find(f => f.isId);
            let pkDef = '"id" UUID PRIMARY KEY DEFAULT gen_random_uuid()';
            if (pkField) {
                pkDef = `"${pkField.name}" ${pkField.sqlType} PRIMARY KEY`;
                if (pkField.sqlType === 'UUID') pkDef += ' DEFAULT gen_random_uuid()';
            }
            sql += `CREATE TABLE IF NOT EXISTS "${modelName}" (${pkDef});\n`;
            for (const field of model.fields) {
                sql += `ALTER TABLE "${modelName}" ADD COLUMN IF NOT EXISTS "${field.name}" ${field.sqlType};\n`;
            }
        }
        sql += 'COMMIT;\n';

        // 4. Execute
        await client.connect();
        await client.query(sql);
        console.log('✅ Database Structure Synced Successfully.');

    } catch (err) {
        console.error('❌ Sync Failed:', err.message);
    } finally {
        await client.end();
    }
}

sync();
