'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function exportLeadsAction(searchParams: any) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { error: 'Unauthorized' }
    }

    const tenantId = session.user.tenantId
    const { q: query, status, source_id: sourceId, owner_id: ownerId, from: fromDate, to: toDate, is_hot: isHot } = searchParams

    const where: any = {
        tenant_id: tenantId,
        deleted_at: null,
        ...(status ? { status } : {}),
        ...(sourceId ? { source_id: sourceId } : {}),
        ...(ownerId ? { owner_id: ownerId } : {}),
        ...(isHot === 'true' ? { is_hot: true } : {}),
        ...((fromDate || toDate) ? {
            created_at: {
                ...(fromDate ? { gte: new Date(fromDate) } : {}),
                ...(toDate ? { lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)) } : {}),
            }
        } : {}),
        ...(query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { company_name: { contains: query, mode: 'insensitive' } },
                { contact_name: { contains: query, mode: 'insensitive' } },
            ]
        } : {})
    }

    try {
        const leads = await prisma.crm_leads.findMany({
            where,
            orderBy: { created_at: 'desc' },
            select: {
                name: true,
                contact_name: true,
                company_name: true,
                email: true,
                phone: true,
                status: true,
                estimated_value: true,
                created_at: true,
                next_followup_date: true,
                owner: {
                    select: { name: true }
                },
                source: {
                    select: { name: true }
                }
            }
        }) as any

        // Format for CSV
        const csvData = leads.map(lead => ({
            'Lead Name': lead.name,
            'Contact Person': lead.contact_name || '',
            'Company': lead.company_name || '',
            'Email': lead.email || '',
            'Phone': lead.phone || '',
            'Status': lead.status,
            'Value': lead.estimated_value?.toString() || '0',
            'Source': lead.source?.name || '',
            'Assigned To': lead.owner?.name || 'Unassigned',
            'Created Date': lead.created_at.toISOString().split('T')[0],
            'Next Follow-up': lead.next_followup_date ? lead.next_followup_date.toISOString().split('T')[0] : ''
        }))

        return { success: true, data: csvData }
    } catch (error) {
        console.error('Export error:', error)
        return { error: 'Failed to export leads' }
    }
}
