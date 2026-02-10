
const { Client } = require('pg');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

async function main() {
    try {
        console.log("Starting Department, Role, and Specialization Seeding (PG version)...");

        if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is missing!");
            return;
        }

        const urls = [
            process.env.DATABASE_URL,
            process.env.DIRECT_DATABASE_URL,
            process.env.DATABASE_URL?.replace('-pooler', ''), // Remove pooler
        ].filter(u => u);

        let client;
        for (const url of urls) {
            try {
                console.log(`Trying to connect via: ${url.replace(/:[^:@]*@/, ':****@')} ...`);
                const tempClient = new Client({ connectionString: url });
                await tempClient.connect();
                console.log("Connected to DB via PG!");
                client = tempClient;
                break;
            } catch (e) {
                console.error(`Failed to connect: ${e.message}`);
            }
        }

        if (!client) {
            console.error("Could not connect to database with any available URL.");
            return;
        }

        // 1. Get Tenant and Company
        console.log("Fetching tenant and company...");

        let tenantId;
        try {
            // Try tenants table
            const tenantRes = await client.query('SELECT id FROM tenants LIMIT 1');
            if (tenantRes.rows.length > 0) {
                tenantId = tenantRes.rows[0].id;
            }
        } catch (e) {
            console.log("Tenants table not found or empty, trying app_user...");
        }

        if (!tenantId) {
            try {
                // Try app_user table
                const userRes = await client.query('SELECT DISTINCT tenant_id FROM app_user WHERE tenant_id IS NOT NULL LIMIT 1');
                if (userRes.rows.length > 0) {
                    tenantId = userRes.rows[0].tenant_id;
                }
            } catch (e) {
                console.log("app_user table not accessible.");
            }
        }

        if (!tenantId) {
            console.error("No tenant ID found! Please ensure data exists.");
            await client.end();
            return;
        }

        // Query to get first company for tenant
        let companyId = tenantId;
        try {
            const companyRes = await client.query('SELECT id FROM companies WHERE tenant_id = $1 LIMIT 1', [tenantId]);
            if (companyRes.rows.length > 0) {
                companyId = companyRes.rows[0].id;
            }
        } catch (e) {
            console.warn("Companies table might not exist or be accessible. Using tenant ID as fallback.");
        }

        console.log(`Using Tenant ID: ${tenantId}`);
        console.log(`Using Company ID: ${companyId}`);

        // 2. Read SQL Files
        const agentDir = path.join(process.cwd(), 'scripts');
        const files = [
            'manual_migration_crm.sql'
        ];

        for (const file of files) {
            console.log(`Processing ${file}...`);
            try {
                const filePath = path.join(agentDir, file);
                let sqlContent = await fs.readFile(filePath, 'utf-8');

                // 3. Replace Placeholders
                sqlContent = sqlContent.replace(/YOUR_TENANT_ID/g, tenantId);
                sqlContent = sqlContent.replace(/YOUR_COMPANY_ID/g, companyId);

                // 4. Split and Execute
                // Split by semi-colon but handle the edge cases naively for now
                const statements = sqlContent
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                for (const statement of statements) {
                    if (statement.startsWith('--')) continue;

                    try {
                        await client.query(statement);
                    } catch (e) {
                        if (e.message.includes('unique constraint') || e.message.includes('duplicate key')) {
                            // console.log("Skipping duplicate entry")
                        } else {
                            console.error(`Error executing statement in ${file}:`, e.message);
                        }
                    }
                }
                console.log(`Successfully processed ${file}`);

            } catch (err) {
                console.error(`Failed to process ${file}:`, err.message);
            }
        }

        console.log("Seeding Complete!");
        await client.end();

    } catch (e) {
        console.error("Fatal Error:", e);
    }
}

main();
