
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Fixing Nurse Menu Permissions...')

    // 1. Force update 'Roles' menu to be Admin Only
    await prisma.menu_items.updateMany({
        where: {
            key: 'roles'
        },
        data: {
            permission_code: 'system:admin' // STRICT Admin Only
        }
    })

    await prisma.menu_items.updateMany({
        where: {
            key: 'settings'
        },
        data: {
            permission_code: 'system:admin'
        }
    })

    // 2. Ensure Nurse Role has correct permissions
    const nurseRole = await prisma.hms_role.findFirst({
        where: { name: 'Nurse' }
    })

    if (nurseRole) {
        // Remove any 'system:admin' or broad permissions if they exist
        await prisma.hms_role_permissions.deleteMany({
            where: {
                role_id: nurseRole.id,
                permission: { in: ['system:admin', 'hms:admin', 'settings:view'] }
            }
        })
        console.log('Cleaned Nurse permissions')
    }

    console.log('✅ Permissions Fixed. Nurses should NOT see Roles now.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
