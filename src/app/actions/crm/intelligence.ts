'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getIntelligenceSummary() {
    const session = await auth()
    const user = session?.user

    if (!user || !user.tenantId) {
        redirect('/login')
    }

    const tenantId = user.tenantId

    // 1. Organizational Pulse
    const [employeeCount, deptCount, designCount] = await Promise.all([
        prisma.crm_employee.count({ where: { tenant_id: tenantId, status: 'active' } }),
        prisma.hms_departments.count({ where: { tenant_id: tenantId } }),
        prisma.crm_designation.count({ where: { tenant_id: tenantId } })
    ])

    // 2. Field Intelligence (Attendance Today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeClockIns = await prisma.crm_attendance.count({
        where: {
            tenant_id: tenantId,
            date: today,
            check_out: null
        }
    })

    // 3. Performance Intelligence (Targets)
    const activeTargets = await prisma.crm_targets.findMany({
        where: { tenant_id: tenantId },
        include: { milestones: true }
    })

    const totalTargetValue = activeTargets.reduce((sum, t) => sum + Number(t.target_value), 0)
    const totalAchievedValue = activeTargets.reduce((sum, t) => sum + Number(t.achieved_value), 0)
    const avgProgression = totalTargetValue > 0 ? (totalAchievedValue / totalTargetValue) * 100 : 0

    // Count blocking milestones
    const blockedCount = await prisma.crm_target_milestones.count({
        where: {
            target: { tenant_id: tenantId },
            status: 'failed',
            is_blocking: true
        }
    })

    // 4. Data Integrity (Leads with Dupes/Score)
    const leads = await prisma.crm_leads.findMany({
        where: { tenant_id: tenantId, deleted_at: null },
        select: { lead_score: true, email: true, phone: true }
    })

    const highQualityLeads = leads.filter(l => (l.lead_score || 0) > 80).length

    // Simple heuristic for "potential messiness"
    const uniqueEmails = new Set(leads.map(l => l.email).filter(Boolean)).size
    const messyLeadCount = leads.length - uniqueEmails

    return {
        org: {
            employees: employeeCount,
            departments: deptCount,
            designations: designCount
        },
        field: {
            activeClockIns,
            coverage: 85 // Mock or calculate based on branches later
        },
        performance: {
            avgProgression: Math.round(avgProgression),
            blockedMilestones: blockedCount,
            activeTargetCount: activeTargets.length
        },
        integrity: {
            score: leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.lead_score || 0), 0) / leads.length) : 0,
            highQualityLeads,
            duplicateRisk: messyLeadCount
        }
    }
}
