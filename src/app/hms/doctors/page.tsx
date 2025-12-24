import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { DoctorsClientPage } from "@/components/hms/doctors/doctors-client-page"

export default async function DoctorsPage({
    searchParams
}: {
    searchParams: Promise<{
        q?: string
    }>
}) {
    const { q } = await searchParams;
    const query = q || ''

    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId

    if (!tenantId || !companyId) {
        return <div className="p-12 text-center font-bold text-red-500 bg-red-50 rounded-3xl">Session Context Missing. Please re-login.</div>
    }

    // Fetch master data - If anything is empty, we perform a world-class seed
    let [departments, roles, specializations] = await Promise.all([
        prisma.hms_departments.findMany({
            where: { tenant_id: tenantId, is_active: true },
            select: { id: true, name: true, parent_id: true },
            orderBy: { name: 'asc' }
        }),
        prisma.hms_roles.findMany({
            where: { tenant_id: tenantId, is_active: true, is_clinical: true },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        }),
        prisma.hms_specializations.findMany({
            where: { tenant_id: tenantId, is_active: true },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    ])

    // World-class auto-seeding if data is missing
    if (departments.length === 0 || roles.length === 0 || specializations.length === 0) {
        if (departments.length === 0) {
            await prisma.hms_departments.createMany({
                data: [
                    { id: crypto.randomUUID(), tenant_id: tenantId, company_id: companyId, name: "Emergency Department", code: "ER" },
                    { id: crypto.randomUUID(), tenant_id: tenantId, company_id: companyId, name: "Intensive Care Unit", code: "ICU" },
                    { id: crypto.randomUUID(), tenant_id: tenantId, company_id: companyId, name: "Outpatient Department", code: "OPD" }
                ]
            });
        }
        if (roles.length === 0) {
            await prisma.hms_roles.createMany({
                data: ["Senior Consultant", "Resident Physician", "Nursing Lead", "Radiology Expert"].map(name => ({
                    id: crypto.randomUUID(), tenant_id: tenantId, company_id: companyId, name, is_clinical: true
                }))
            });
        }
        if (specializations.length === 0) {
            await prisma.hms_specializations.createMany({
                data: ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"].map(name => ({
                    id: crypto.randomUUID(), tenant_id: tenantId, company_id: companyId, name
                }))
            });
        }

        // Re-fetch after seeding
        [departments, roles, specializations] = await Promise.all([
            prisma.hms_departments.findMany({ where: { tenant_id: tenantId, is_active: true }, select: { id: true, name: true, parent_id: true }, orderBy: { name: 'asc' } }),
            prisma.hms_roles.findMany({ where: { tenant_id: tenantId, is_active: true, is_clinical: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
            prisma.hms_specializations.findMany({ where: { tenant_id: tenantId, is_active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } })
        ]);
    }

    // Fetch clinicians
    const doctors = await prisma.hms_clinicians.findMany({
        where: {
            tenant_id: tenantId,
            ...(query ? {
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { hms_specializations: { name: { contains: query, mode: 'insensitive' } } }
                ]
            } : {})
        },
        include: {
            hms_roles: true,
            hms_specializations: true
        },
        orderBy: [
            { is_active: 'desc' },
            { first_name: 'asc' }
        ]
    })

    const stats = {
        total: doctors.length,
        active: doctors.filter(d => d.is_active === true).length,
        specializations: new Set(doctors.map(d => d.hms_specializations?.name).filter(Boolean)).size
    }

    return (
        <div className="p-6">
            <DoctorsClientPage
                doctors={JSON.parse(JSON.stringify(doctors))}
                stats={stats}
                departments={JSON.parse(JSON.stringify(departments))}
                roles={JSON.parse(JSON.stringify(roles))}
                specializations={JSON.parse(JSON.stringify(specializations))}
            />
        </div>
    )
}
