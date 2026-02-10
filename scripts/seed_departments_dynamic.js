
const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting Department, Role, and Specialization Seeding (JS version)...");

        if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is missing!");
            return;
        }

        // 1. Get Tenant and Company
        console.log("Connecting to DB...");
        const tenant = await prisma.tenants.findFirst();
        if (!tenant) {
            console.error("No tenant found! Please ensure at least one tenant exists.");
            return;
        }

        const company = await prisma.companies.findFirst({
            where: { tenant_id: tenant.id }
        });

        const companyId = company?.id || tenant.id;

        console.log(`Using Tenant ID: ${tenant.id}`);
        console.log(`Using Company ID: ${companyId}`);

        // 2. Read SQL Files
        const agentDir = path.join(process.cwd(), '.agent');
        const files = [
            'seed_departments.sql',
            'seed_roles.sql',
            'seed_specializations.sql'
        ];

        for (const file of files) {
            console.log(`Processing ${file}...`);
            try {
                const filePath = path.join(agentDir, file);
                let sqlContent = await fs.readFile(filePath, 'utf-8');

                // 3. Replace Placeholders
                sqlContent = sqlContent.replace(/YOUR_TENANT_ID/g, tenant.id);
                sqlContent = sqlContent.replace(/YOUR_COMPANY_ID/g, companyId);

                // 4. Split and Execute
                const statements = sqlContent
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                for (const statement of statements) {
                    if (statement.startsWith('--')) continue;

                    try {
                        await prisma.$executeRawUnsafe(statement);
                    } catch (e) {
                        if (e.message.includes('Unique constraint') || e.message.includes('duplicate key')) {
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

    } catch (e) {
        console.error("Fatal Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
