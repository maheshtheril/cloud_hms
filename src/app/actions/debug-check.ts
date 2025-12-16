'use server'

import { prisma } from '@/lib/prisma'

export async function runDiagnostics(email: string) {
    if (!email) return { error: 'No email provided' }

    const user = await prisma.app_user.findFirst({ where: { email } })
    if (!user) return { error: 'User not found in DB' }

    const company = user.company_id
        ? await prisma.company.findFirst({ where: { id: user.company_id } })
        : null
    const tenantModules = await prisma.tenant_module.findMany({
        where: { tenant_id: user.tenant_id, enabled: true }
    })

    // Check Master Modules Table
    const masterModules = await prisma.modules.findMany();

    return {
        user: { id: user.id, email: user.email, companyId: user.company_id, tenantId: user.tenant_id },
        company: company ? { id: company.id, name: company.name, industry: company.industry } : null,
        modules: tenantModules.map(m => m.module_key),
        masterModules: masterModules.map(m => m.module_key),
        analysis: {
            hasCRM: tenantModules.some(m => m.module_key === 'crm'),
            hasHMS: tenantModules.some(m => m.module_key === 'hms'),
            isHealthcare: !company?.industry || company.industry === 'Healthcare' || company.industry === 'Hospital',
            crmExistsInMaster: masterModules.some(m => m.module_key === 'crm')
        }
    }
}

export async function enableCRM(email: string) {
    if (!email) return { error: 'No email' }
    const user = await prisma.app_user.findFirst({ where: { email } })
    if (!user) return { error: 'User not found' }

    // Ensure it exists in master first (if FK enforces it)
    const crmMaster = await prisma.modules.findUnique({ where: { module_key: 'crm' } });
    if (!crmMaster) {
        // Create it on the fly if missing
        await prisma.modules.create({
            data: { module_key: 'crm', name: 'CRM', description: 'Customer Relationship Management' }
        }).catch(() => { })
    }

    await prisma.tenant_module.create({
        data: {
            tenant_id: user.tenant_id,
            module_key: 'crm',
            enabled: true
        }
    }).catch(() => { }) // Ignore if exists

    return { success: true }
}
