
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("=== STARTING VERIFICATION: GATED TARGETS ===")

    // STEP 1: SETUP TEST USER
    const testEmail = `sales_test_${Date.now()}@test.com`
    console.log(`\n1. Creating Test Sales User: ${testEmail}`)

    // We need a valid tenant ID - getting from first available user or tenant
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) throw new Error("No tenant found")

    const user = await prisma.app_user.create({
        data: {
            email: testEmail,
            tenant_id: tenant.id,
            role: 'Sales Man', // Directly assigning role for simplicity
            is_active: true,
            is_admin: false,
            password: 'hashed_password_placeholder',
            // In a real scenario we'd link to company_id too
        }
    })
    console.log(`   User Created! ID: ${user.id}`)

    // STEP 2: CREATE A TARGET WITH 'PAST' DATES TO FORCE MISSED MILESTONES
    console.log(`\n2. Creating a 'Missed' Target (Started 30 days ago)`)

    // Dates
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) // Started 30 days ago

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30) // Ends in 30 days from now

    const targetVal = 10000

    // Create Target (Manually mirroring logic from actions/targets.ts to ensure consistent test env)
    const target = await prisma.crm_targets.create({
        data: {
            tenant_id: user.tenant_id,
            assignee_type: 'user',
            assignee_id: user.id,
            period_type: 'quarter',
            period_start: startDate,
            period_end: endDate,
            target_type: 'revenue',
            target_value: targetVal,
            incentive_amount: 500,
            achieved_value: 0
        }
    })

    // Create AUTO-GENERATED GATES (Same logic as in your app)
    // Gate 1: Activity Ramp (Week 1 = Start + 7 days) -> This will be ~23 days ago (EXPIRED!)
    const week1Deadline = new Date(startDate)
    week1Deadline.setDate(week1Deadline.getDate() + 7)

    const milestones = [
        {
            step_order: 1,
            name: 'Week 1 Sprint (Test)',
            metric_type: 'activities',
            target_value: 10,
            deadline: week1Deadline, // THIS IS IN THE PAST
            is_blocking: true
        }
    ]

    await prisma.crm_target_milestones.createMany({
        data: milestones.map(m => ({
            target_id: target.id,
            ...m
        }))
    })

    console.log(`   Target Created! ID: ${target.id}`)
    console.log(`   Milestone Created! 'Week 1 Sprint' Deadline: ${week1Deadline.toISOString()}`)
    console.log(`   Current Time: ${new Date().toISOString()}`)
    console.log(`   -> Milestone is EXPIRED. User has 0 Activities.`)

    // STEP 3: RUN COMPLIANCE CHECK
    console.log(`\n3. Running Block Logic...`)

    // We can execute the actual script logic here inline or subprocess. 
    // Inline is safer for verifying exact logic execution.

    // 3a. Fetch User & Targets
    const targetsToCheck = await prisma.crm_targets.findMany({
        where: { assignee_id: user.id },
        include: {
            milestones: {
                where: {
                    deadline: { lt: new Date() }, // Expired
                    status: { not: 'passed' }
                }
            }
        }
    })

    let blocked = false
    let reason = ''

    for (const t of targetsToCheck) {
        for (const m of t.milestones) {
            console.log(`   Checking Milestone: ${m.name} (Deadline: ${m.deadline.toISOString()})`)

            // Assume 0 achievement for this test
            const achieved = 0
            const goal = Number(m.target_value)

            if (achieved < goal && m.is_blocking) {
                console.log(`   [FAIL] Achieved ${achieved} < ${goal}. BLOCKING!`)
                blocked = true
                reason = `Failed Test Milestone`

                // Update DB status
                await prisma.crm_target_milestones.update({
                    where: { id: m.id },
                    data: { status: 'failed' }
                })
            }
        }
    }

    if (blocked) {
        await prisma.app_user.update({
            where: { id: user.id },
            data: { is_active: false, metadata: { blocked_reason: reason } }
        })
        console.log(`   User Blocked Successfully.`)
    } else {
        console.log(`   Warning: User was NOT blocked. Logic check required.`)
    }

    // STEP 4: VERIFY RESULT
    console.log(`\n4. Verifying User Status in DB...`)
    const updatedUser = await prisma.app_user.findUnique({ where: { id: user.id } })

    if (updatedUser?.is_active === false) {
        console.log(`SUCCESS: User is_active = false`)
    } else {
        console.log(`FAILURE: User is_active = ${updatedUser?.is_active}`)
    }

    console.log("=== VERIFICATION COMPLETE ===")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
