const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

function parseSchema(schemaPath) {
    const content = fs.readFileSync(schemaPath, 'utf8');
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
                else if (type === 'BigInt') sqlType = 'BIGINT';
                else if (type === 'Float') sqlType = 'DOUBLE PRECISION';
                else if (type === 'Decimal') sqlType = 'DECIMAL(20,4)';
                else if (type === 'DateTime') sqlType = 'TIMESTAMP WITH TIME ZONE';
                else if (type === 'Json') sqlType = 'JSONB';
                else if (type === 'Bytes') sqlType = 'BYTEA';
                else if (type === 'String') sqlType = 'TEXT';
                if (trimmed.includes('[]')) sqlType += '[]';
                models[currentModel].fields.push({ name, sqlType, isId: trimmed.includes('@id') });
            }
        }
    }
    return models;
}

async function run() {
    try {
        const models = parseSchema('prisma/schema.prisma');
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
        console.log('Connecting to Seeakk DB via IP...');
        await client.connect();
        console.log('Connected to Seeakk DB.');
        await client.query(sql);
        console.log('✅ Seeakk Schema Synced.');
    } catch (e) {
        console.error(e);
        try { await client.query('ROLLBACK;'); } catch (r) { }
    } finally {
        await client.end();
    }
}
run();
