
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * World Standard Compliance Logic (Gated Progression)
 * Blocks user ONLY if they fail a blocking Milestone by its deadline.
 * Only applies to roles: 'Sales Man', 'Salesman', 'Sales Agent'.
 */

async function main() {
    console.log('Starting World-Standard CRM Compliance Check...')

    // 1. Fetch Sales Users
    const users = await prisma.app_user.findMany({
        where: {
            is_active: true,
            OR: [
                { role: { equals: 'Sales Man', mode: 'insensitive' } },
                { role: { equals: 'Salesman', mode: 'insensitive' } },
                { role: { equals: 'Sales Agent', mode: 'insensitive' } },
                {
                    hms_user_roles: {
                        some: { hms_role: { name: { in: ['Sales Man', 'Salesman', 'Sales Agent'], mode: 'insensitive' } } }
                    }
                }
            ]
        },
        include: { hms_user_roles: { include: { hms_role: true } } }
    })

    console.log(`Found ${users.length} active sales agents to monitor.`)
    const now = new Date()

    for (const user of users) {
        if (user.is_admin || user.is_platform_admin || user.is_tenant_admin) continue

        // 2. Fetch Active Targets
        // We look for targets that are ACTIVE (not deleted)
        // We inspect milestones that have EXPIRED (deadline < now) but are PENDING or FAILED
        const targets = await prisma.crm_targets.findMany({
            where: {
                assignee_id: user.id,
                deleted_at: null,
            },
            include: {
                milestones: {
                    where: {
                        deadline: { lt: now }, // Deadline has passed
                        status: { not: 'passed' } // Not yet passed
                    }
                }
            }
        })

        if (!targets.length) continue

        let blocked = false
        let reason = ''

        for (const target of targets) {
            // Iterate only through the EXPIRED milestones for this target
            for (const milestone of target.milestones) {

                // Calculate Achievement for this Milestone Metric
                let achieved = 0

                if (milestone.metric_type === 'revenue' || milestone.metric_type === 'pipeline_value') {
                    // Sum Opportunity Value
                    const deals = await prisma.crm_deals.findMany({
                        where: {
                            owner_id: user.id,
                            // For Revenue: Status WON. For Pipeline: OPEN or WON
                            status: milestone.metric_type === 'revenue' ? { equals: 'won', mode: 'insensitive' } : { not: 'lost' },
                            updated_at: {
                                gte: target.period_start,
                                lte: milestone.deadline // Check progress up to the deadline
                            }
                        },
                        select: { value: true }
                    })
                    achieved = deals.reduce((sum, d) => sum + Number(d.value || 0), 0)

                } else if (milestone.metric_type === 'calls' || milestone.metric_type === 'activities') {
                    // Count Activities
                    achieved = await prisma.crm_activities.count({
                        where: {
                            owner_id: user.id,
                            created_at: {
                                gte: target.period_start,
                                lte: milestone.deadline
                            }
                        }
                    })
                }

                // Update Milestone Status
                await prisma.crm_target_milestones.update({
                    where: { id: milestone.id },
                    data: { achieved_value: achieved }
                })

                const targetVal = Number(milestone.target_value)

                console.log(`User ${user.email} | Milestone: ${milestone.name} [${milestone.metric_type}] | Goal: ${targetVal} | Achieved: ${achieved}`)

                if (achieved < targetVal) {
                    // FAILED
                    await prisma.crm_target_milestones.update({
                        where: { id: milestone.id },
                        data: { status: 'failed' }
                    })

                    if (milestone.is_blocking) {
                        blocked = true
                        reason = `Failed Critical Milestone: ${milestone.name} (Deadline: ${milestone.deadline.toISOString().split('T')[0]}). Achieved ${achieved}/${targetVal}.`
                        break // Stop checking this target, user is blocked
                    }
                } else {
                    // PASSED
                    await prisma.crm_target_milestones.update({
                        where: { id: milestone.id },
                        data: { status: 'passed' }
                    })
                }
            }
            if (blocked) break
        }

        if (blocked) {
            console.log(`!!! BLOCKING AGENT ${user.email} - ${reason}`)
            await prisma.app_user.update({
                where: { id: user.id },
                data: {
                    is_active: false,
                    metadata: {
                        ...(user.metadata as object || {}),
                        blocked_reason: reason,
                        blocked_at: new Date().toISOString()
                    }
                }
            })
        } else {
            console.log(`Agent ${user.email} status: Secure.`)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
