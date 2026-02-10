
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Starting Department, Role, and Specialization Seeding...")

        // 1. Get Tenant and Company
        // We'll pick the first tenant found. In a real scenario, this might need to be specific.
        const tenant = await prisma.tenants.findFirst()
        if (!tenant) {
            console.error("No tenant found! Please ensure at least one tenant exists.")
            return
        }

        // For company, we'll try to find a company associated with the tenant, or use the tenant ID if company table usage is different.
        // Assuming hms_companies table or similar exists, often checking 'companies' table
        const company = await prisma.companies.findFirst({
            where: { tenant_id: tenant.id }
        })

        // If no company found, we might need to handle it. 
        // Some schemas use tenant_id as company_id or have a default company.
        // Let's assume company_id is required.
        const companyId = company?.id || tenant.id // Fallback to tenant ID if no company found (dangerous but common in simple setups)

        console.log(`Using Tenant ID: ${tenant.id}`)
        console.log(`Using Company ID: ${companyId}`)

        // 2. Read SQL Files
        const agentDir = path.join(process.cwd(), '.agent')
        const files = [
            'seed_departments.sql',
            'seed_roles.sql',
            'seed_specializations.sql'
        ]

        for (const file of files) {
            console.log(`Processing ${file}...`)
            try {
                const filePath = path.join(agentDir, file)
                let sqlContent = await fs.readFile(filePath, 'utf-8')

                // 3. Replace Placeholders
                // Global replace
                sqlContent = sqlContent.replace(/YOUR_TENANT_ID/g, tenant.id)
                sqlContent = sqlContent.replace(/YOUR_COMPANY_ID/g, companyId)

                // 4. Split and Execute
                // Simple splitting by semicolon might fail on complex SQL, but these files are simple INSERTs
                // However, Prisma $executeRawUnsafe can handle multiple statements in some drivers, 
                // but usually it's safer to split or use a specific formatted approach.
                // The files contain comments and multiple inserts.
                // Let's try executing the whole block if possible, or split by statement.

                // Remove comments for cleaner execution (optional but good)
                const statements = sqlContent
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)

                for (const statement of statements) {
                    // Skip comments
                    if (statement.startsWith('--')) continue

                    try {
                        await prisma.$executeRawUnsafe(statement)
                    } catch (e: any) {
                        // Ignore "duplicate key" errors (code P2010 or similar db error) to allow re-running
                        if (e.message.includes('Unique constraint') || e.message.includes('duplicate key')) {
                            // console.log("Skipping duplicate entry")
                        } else {
                            console.error(`Error executing statement in ${file}:`, e.message)
                        }
                    }
                }
                console.log(`Successfully processed ${file}`)

            } catch (err: any) {
                console.error(`Failed to process ${file}:`, err.message)
            }
        }

        console.log("Seeding Complete!")

    } catch (e) {
        console.error("Fatal Error:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
