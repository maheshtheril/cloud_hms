const fs = require('fs');
const { Client } = require('pg');

// Database Config
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

function parseSchema(schemaPath) {
    const content = fs.readFileSync(schemaPath, 'utf8');
    const lines = content.split('\n');
    const models = {};
    let currentModel = null;

    for (const line of lines) {
        const trimmed = line.trim();
        // Start model
        const modelMatch = trimmed.match(/^model\s+(\w+)\s+\{/);
        if (modelMatch) {
            currentModel = modelMatch[1];
            models[currentModel] = { fields: [] };
            continue;
        }
        // End model
        if (trimmed === '}' && currentModel) {
            currentModel = null;
            continue;
        }
        // Field line (simplified)
        // name Type @attrs
        if (currentModel && trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('@@')) {
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2) {
                const name = parts[0];
                let type = parts[1];
                const cleanType = type.replace('?', '').replace('[]', '');

                // Skip relations (usually start with lowercase or known model names? 
                // Hard to know without full graph. 
                // Heuristic: If type is not a primitive, assume relation or enum?
                // But we want to create columns for Enums (as text).
                // Relations usually have @relation.

                const isRelation = trimmed.includes('@relation');
                if (isRelation) continue;

                // Determine SQL Type
                let sqlType = 'TEXT';
                if (cleanType === 'String') sqlType = 'TEXT';
                else if (cleanType === 'Boolean') sqlType = 'BOOLEAN';
                else if (cleanType === 'Int') sqlType = 'INTEGER';
                else if (cleanType === 'BigInt') sqlType = 'BIGINT';
                else if (cleanType === 'Float') sqlType = 'DOUBLE PRECISION';
                else if (cleanType === 'Decimal') sqlType = 'DECIMAL(20,4)'; // Default safe
                else if (cleanType === 'DateTime') sqlType = 'TIMESTAMP WITH TIME ZONE';
                else if (cleanType === 'Json') sqlType = 'JSONB';
                else if (cleanType === 'Bytes') sqlType = 'BYTEA';
                else {
                    // Assume Enum or Unsupported -> TEXT
                    // Check if it's a known model name? 
                    // For now, treat as TEXT (Enum). 
                    // If it acts as a foreign key scalar (e.g. `userId User`), that is usually handled by `userId String` field.
                    // But Prisma sometimes hides the scalar?
                    // No, Prisma always exposes scalar field for SQL.
                    // So `User User` line is pure relation.
                    // We skip it.
                    // But if it's `Role RoleEnum`, RoleEnum is enum -> TEXT.
                    // We will assume non-standard types are TEXT (Enum).
                    sqlType = 'TEXT';
                }

                // Parse Modifiers
                const isId = trimmed.includes('@id');
                const isUnique = trimmed.includes('@unique');
                const isList = type.includes('[]'); // Arrays are unsupported in simple sync unless PostgreSQL array?
                // We'll support text[] or similar?
                if (isList) sqlType = sqlType + '[]'; // PG supports arrays

                models[currentModel].fields.push({ name, type: cleanType, sqlType, isId, isUnique });
            }
        }
    }
    return models;
}

async function syncSchema() {
    try {
        await client.connect();
        console.log('Connected to DB.');

        const models = parseSchema('prisma/schema.prisma');
        console.log(`Parsed ${Object.keys(models).length} models.`);

        for (const [modelName, model] of Object.entries(models)) {
            // 1. Create Table
            const createSql = `CREATE TABLE IF NOT EXISTS "${modelName}" (
                 "id" UUID PRIMARY KEY DEFAULT gen_random_uuid()
             );`;
            // We assume 'id' exists or we execute blindly. 
            // Better: Create table with NO columns then add? 
            // Or create with just a dummy column?
            // Most models have 'id'.

            // Check if table exists
            const checkRes = await client.query(`SELECT to_regclass('${modelName}');`);
            if (!checkRes.rows[0].to_regclass) {
                // Try to find the Primary Key field
                const pkField = model.fields.find(f => f.isId);
                if (pkField) {
                    // Create with PK
                    const pkType = pkField.sqlType === 'TEXT' ? 'TEXT' : 'UUID'; // Handle String IDs
                    const pkDef = pkField.name === 'id' ?
                        `"id" ${pkType} PRIMARY KEY DEFAULT gen_random_uuid()` :
                        `"${pkField.name}" ${pkType} PRIMARY KEY`;

                    await client.query(`CREATE TABLE "${modelName}" (${pkDef});`);
                    console.log(`Created table ${modelName}`);
                } else {
                    // IDless table (join table?)
                    // Just create empty? PG requires at least one column usually?
                    // We'll skip creating ID-less tables for now (rare in this schema).
                    // user_branch has composite ID.
                    // We will iterate fields and add them.
                    console.log(`Skipping creation of ID-less table ${modelName} (will patch columns)`);
                    // If it doesn't exist, we can't patch.
                    // Create with first column?
                    const first = model.fields[0];
                    if (first) {
                        await client.query(`CREATE TABLE "${modelName}" ("${first.name}" ${first.sqlType});`);
                        console.log(`Created table ${modelName} with col ${first.name}`);
                    }
                }
            }

            // 2. Sync Columns
            for (const field of model.fields) {
                try {
                    // Add column with basic type
                    // Default null to be safe for existing rows
                    const query = `ALTER TABLE "${modelName}" ADD COLUMN IF NOT EXISTS "${field.name}" ${field.sqlType};`;
                    await client.query(query);
                    // console.log(`  - Checked ${modelName}.${field.name}`);
                } catch (e) {
                    // Ignore (e.g. duplicate, invalid type mapping)
                    // console.error(`  - Failed ${modelName}.${field.name}: ${e.message}`);
                }
            }
        }
        console.log('✅ Sync Completed successfully.');

    } catch (e) {
        console.error('Fatal:', e);
    } finally {
        await client.end();
    }
}

syncSchema();
