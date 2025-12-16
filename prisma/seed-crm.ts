
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Seeding CRM menu items (Destructive Update)...')

    // 1. Delete ALL CRM menus to ensure clean slate and correct order
    // We target anything with module_key='crm' OR likely legacy keys
    await prisma.menu_items.deleteMany({
        where: {
            OR: [
                { module_key: 'crm' },
                { key: { startsWith: 'crm' } } // Catch crm-root, crm-leads, etc.
            ]
        }
    });
    console.log('🗑️ Deleted old CRM menus.')

    // 2. Define the exact "World Class" list
    const crmMenus = [
        { key: 'crm-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/crm/dashboard', sort: 10 },
        { key: 'crm-scheduler', label: 'Scheduler', icon: 'Calendar', url: '/crm/scheduler', sort: 20 },
        { key: 'crm-leads', label: 'Smart Leads', icon: 'Zap', url: '/crm/leads', sort: 30 },
        { key: 'crm-deals', label: 'Deals', icon: 'DollarSign', url: '/crm/deals', sort: 40 },
        { key: 'crm-contacts', label: 'Contacts', icon: 'Users', url: '/crm/contacts', sort: 50 },
        { key: 'crm-accounts', label: 'Accounts', icon: 'Building2', url: '/crm/accounts', sort: 60 },
        { key: 'crm-activities', label: 'Activities', icon: 'Activity', url: '/crm/activities', sort: 70 },
        { key: 'crm-attendance', label: 'Attendance', icon: 'MapPin', url: '/crm/attendance', sort: 80 },
        { key: 'crm-targets', label: 'Targets', icon: 'Target', url: '/crm/targets', sort: 90 },
        { key: 'crm-reports', label: 'Reports', icon: 'BarChart', url: '/crm/reports', sort: 100 },
        { key: 'crm-settings', label: 'Settings', icon: 'Settings', url: '/crm/settings', sort: 110 },
    ];

    // 3. Insert fresh
    for (const item of crmMenus) {
        console.log(`Creating ${item.label}...`)
        await prisma.menu_items.create({
            data: {
                module_key: 'crm',
                key: item.key,
                label: item.label,
                icon: item.icon,
                url: item.url,
                sort_order: item.sort,
                is_global: true, // Visible to all CRM users
                parent_id: null // Flat structure
            }
        })
    }

    console.log('✅ CRM Seeding completed with proper order.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
