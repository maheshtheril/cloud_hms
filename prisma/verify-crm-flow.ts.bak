import { prisma } from '../src/lib/prisma'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Starting Futuristic CRM Verification...')

    // 1. Setup Context (Tenant & User)
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) throw new Error('No tenant found. Run seed first.')

    const user = await prisma.app_user.findFirst({ where: { tenant_id: tenant.id } })
    if (!user) throw new Error('No user found.')

    console.log(`👤 Using User: ${user.email}`)

    // 2. Create SMART LEAD
    console.log('\nTesting Smart Lead Creation (AI Fields)...')
    const lead = await prisma.crm_leads.create({
        data: {
            tenant_id: tenant.id,
            owner_id: user.id,
            name: 'AI Verified Mega Project',
            company_name: 'Future Corp',
            lead_score: 95, // AI Field
            ai_summary: 'AI Analysis: High intent detected based on email sentiment and interaction frequency.', // AI Field
            is_hot: true, // AI Field
            status: 'new',
            next_followup_date: new Date(Date.now() + 86400000) // Tomorrow
        }
    })
    console.log(`✅ Lead Created: ${lead.name}`)
    console.log(`   - Score: ${lead.lead_score}`)
    console.log(`   - AI Summary: ${lead.ai_summary}`)

    // 3. Create DEAL
    console.log('\nTesting Deal Pipeline...')
    const deal = await prisma.crm_deals.create({
        data: {
            tenant_id: tenant.id,
            owner_id: user.id,
            title: 'Future Corp License Deal',
            value: 50000,
            currency: 'USD',
            status: 'open',
            probability: 80,
            contact_id: lead.id // Linking to lead as mock contact for now or just generic
        }
    })
    console.log(`✅ Deal Created: ${deal.title} ($${deal.value})`)

    // 4. Create ACTIVITY (Sentiment & Geo)
    console.log('\nTesting Activity Log (Sentiment & Geo)...')
    const activity = await prisma.crm_activities.create({
        data: {
            tenant_id: tenant.id,
            owner_id: user.id,
            subject: 'On-site Visit',
            type: 'meeting',
            description: 'Met with CEO. Very positive vibes.',
            sentiment_score: 88, // AI Field
            location_lat: 34.0522, // Geo Field
            location_lng: -118.2437, // Geo Field
            deal_id: deal.id,
            related_to_type: 'deal',
            related_to_id: deal.id
        }
    })
    console.log(`✅ Activity Logged: ${activity.subject}`)
    console.log(`   - Sentiment: ${activity.sentiment_score}/100`)
    console.log(`   - Location: ${activity.location_lat}, ${activity.location_lng}`)

    // 5. Check Soft Delete
    console.log('\nTesting Soft Delete...')
    await prisma.crm_leads.update({
        where: { id: lead.id },
        data: { deleted_at: new Date() }
    })
    const deletedLead = await prisma.crm_leads.findFirst({ where: { id: lead.id } })
    if (deletedLead?.deleted_at) {
        console.log(`✅ Soft Delete Verified. deleted_at is set.`)
    } else {
        console.error('❌ Soft Delete Failed.')
    }

    console.log('\n🎉 CRM Schema Verification Complete! The system is ready for the Future.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
