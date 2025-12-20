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

    // Get session for tenant filtering
    const session = await auth()
    const tenantId = session?.user?.tenantId

    // Fetch clinicians with their related role and specialization
    const doctors = await prisma.hms_clinicians.findMany({
        where: {
            ...(tenantId ? { tenant_id: tenantId } : {}),
            ...(query ? {
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    {
                        hms_specializations: {
                            name: { contains: query, mode: 'insensitive' }
                        }
                    }
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

    // Fetch departments, roles, and specializations for the form
    const [departments, roles, specializations] = await Promise.all([
        prisma.hms_departments.findMany({
            where: {
                ...(tenantId ? { tenant_id: tenantId } : {}),
                is_active: true
            },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        }),
        prisma.hms_roles.findMany({
            where: {
                ...(tenantId ? { tenant_id: tenantId } : {}),
                is_active: true,
                is_clinical: true
            },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        }),
        prisma.hms_specializations.findMany({
            where: {
                ...(tenantId ? { tenant_id: tenantId } : {}),
                is_active: true
            },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    ])

    // Calculate stats
    const stats = {
        total: doctors.length,
        active: doctors.filter(d => d.is_active === true).length,
        specializations: new Set(doctors.map(d => d.hms_specializations?.name).filter(Boolean)).size
    }

    return <DoctorsClientPage
        doctors={doctors}
        stats={stats}
        departments={departments}
        roles={roles}
        specializations={specializations}
    />
}
