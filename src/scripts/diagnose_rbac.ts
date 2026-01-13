
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("--- DIAGNOSTIC START ---")

    // 1. Check Nurse Role Permissions
    console.log("\n1. NURSE ROLE PERMISSIONS:")
    const roles = await prisma.role.findMany({
        where: { key: 'nurse' },
        include: { role_permissions: true }
    })

    if (roles.length === 0) {
        console.log("CRITICAL: No 'nurse' role found in database!")
    }

    for (const r of roles) {
        console.log(`Role: ${r.name} (Tenant: ${r.tenant_id})`)
        console.log(`Permissions (Array):`, r.permissions)
        console.log(`Permissions (Table):`, r.role_permissions.map(rp => rp.permission_code))
    }

    // 2. Check Menu Items
    console.log("\n2. RELEVANT MENU ITEMS:")
    const keysToCheck = ['hms-nursing', 'hms-patients', 'hms-appointments']
    const menus = await prisma.menu_items.findMany({
        where: { key: { in: keysToCheck } }
    })

    for (const m of menus) {
        console.log(`Menu: ${m.label} (Key: ${m.key})`)
        console.log(` - Permission Required: ${m.permission_code}`)
        console.log(` - URL: ${m.url}`)
        console.log(` - Module: ${m.module_key}`)
        console.log(` - Is active? ${!m.is_hidden}`)
    }

    console.log("--- DIAGNOSTIC END ---")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
