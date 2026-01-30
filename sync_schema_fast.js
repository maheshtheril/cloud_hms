const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
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
                else sqlType = 'TEXT'; // Enum/Default

                const isId = trimmed.includes('@id');
                if (trimmed.includes('[]')) sqlType += '[]';
                models[currentModel].fields.push({ name, sqlType, isId });
            }
        }
    }
    return models;
}

async function syncFast() {
    try {
        const models = parseSchema('prisma/schema.prisma');
        console.log(`Parsed ${Object.keys(models).length} models. Generating SQL...`);

        let sql = 'BEGIN;\n';

        for (const [modelName, model] of Object.entries(models)) {
            // PK Logic
            const pkField = model.fields.find(f => f.isId);
            let pkDef = '"id" UUID PRIMARY KEY DEFAULT gen_random_uuid()'; // Fallback
            if (pkField) {
                pkDef = `"${pkField.name}" ${pkField.sqlType} PRIMARY KEY`;
                if (pkField.sqlType === 'UUID') pkDef += ' DEFAULT gen_random_uuid()';
            } else {
                // Table without ID (e.g. join table without explicit ID in Prisma?)
                // If model has no @id, it usually has @@id.
                // We'll skip creating a PK for now and just rely on columns if table is created.
                // But CREATE TABLE needs columns.
                // If no PK field found, use first column?
                if (model.fields.length > 0) {
                    pkDef = `"${model.fields[0].name}" ${model.fields[0].sqlType}`;
                }
            }

            sql += `CREATE TABLE IF NOT EXISTS "${modelName}" (${pkDef});\n`;

            for (const field of model.fields) {
                sql += `ALTER TABLE "${modelName}" ADD COLUMN IF NOT EXISTS "${field.name}" ${field.sqlType};\n`;
            }
        }

        sql += 'COMMIT;\n';

        console.log('Connecting and executing...');
        await client.connect();
        await client.query(sql);
        console.log('✅ Fast Sync Completed!');

    } catch (e) {
        console.error('Fatal:', e);
        await client.query('ROLLBACK;');
    } finally {
        await client.end();
    }
}

syncFast();
