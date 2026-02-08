
import { prisma } from '../src/lib/prisma'
import 'dotenv/config'

async function main() {
    const email = 'admin@saaserp.com'
    const password = 'password123'
    console.log(`Setting password for user: ${email}`)

    // 1. Find User (Don't filter by active yet)
    const existingUser = await prisma.app_user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
    })

    if (!existingUser) {
        console.log('User NOT FOUND. Creating new admin user...')
        // Need a tenant. Pick first one.
        const tenant = await prisma.tenant.findFirst()
        if (!tenant) {
            console.error('CRITICAL: No tenants found in database. Cannot create user.')
            return
        }

        // Need a company for the tenant
        const company = await prisma.company.findFirst({ where: { tenant_id: tenant.id } })

        const newUser = await prisma.$queryRaw`
            INSERT INTO app_user (
                tenant_id, 
                company_id,
                email, 
                password, 
                is_active, 
                is_admin, 
                is_tenant_admin,
                name,
                role
            ) VALUES (
                ${tenant.id}::uuid,
                ${company ? company.id : null}::uuid,
                ${email}, 
                crypt(${password}, gen_salt('bf')), 
                true, 
                true, 
                true,
                'System Admin',
                'admin'
            )
            RETURNING id, email
        `
        console.log('User CREATED successfully.')
    } else {
        console.log(`User found (ID: ${existingUser.id}). Resetting password and activating...`)

        // Update via raw query to use pgcrypto
        await prisma.$executeRaw`
            UPDATE app_user 
            SET password = crypt(${password}, gen_salt('bf')),
                is_active = true,
                is_admin = true,
                is_tenant_admin = true
            WHERE id = ${existingUser.id}::uuid
        `
        console.log('User UPDATED successfully.')
    }
}

main()
    .catch((e) => {
        console.error('FULL ERROR DETAILS:', JSON.stringify(e, null, 2))
        console.error('Error Message:', e.message)
        console.error('Error Code:', e.code)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
