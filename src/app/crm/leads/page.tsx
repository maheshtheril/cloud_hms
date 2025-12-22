import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles, TrendingUp, IndianRupee, PieChart, Filter, Search, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { LeadTable } from '@/components/crm/lead-table'
import { Input } from '@/components/ui/input'
import { SearchLeads } from '@/components/crm/search-leads'

import { getCompanyDefaultCurrency } from '@/app/actions/currency'

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: {
        page?: string
        limit?: string
        q?: string
    }
}

export default async function LeadsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const defaultCurrency = await getCompanyDefaultCurrency()

    const page = Number(searchParams?.page) || 1
    const limit = Number(searchParams?.limit) || 20
    const query = searchParams?.q || ''
    const skip = (page - 1) * limit
    // ... rest of the logic ...
    const where: any = {
        tenant_id: tenantId || undefined,
        deleted_at: null,
        ...(query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { company_name: { contains: query, mode: 'insensitive' } },
                { contact_name: { contains: query, mode: 'insensitive' } },
            ]
        } : {})
    }

    // Parallel data fetching for performance
    const [leads, totalCount, stats] = await Promise.all([
        prisma.crm_leads.findMany({
            where,
            take: limit,
            skip: skip,
            orderBy: { created_at: 'desc' },
            include: { stage: true }
        }),
        prisma.crm_leads.count({
            where
        }),
        prisma.crm_leads.aggregate({
            where: {
                tenant_id: tenantId || undefined,
                deleted_at: null
            },
            _sum: {
                estimated_value: true
            }
        })
    ])

    const hotLeadsCount = await prisma.crm_leads.count({
        where: {
            tenant_id: tenantId || undefined,
            is_hot: true,
            deleted_at: null
        }
    })

    const totalValue = Number(stats._sum.estimated_value) || 0

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto py-8 space-y-8 max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
                        <p className="text-slate-500 mt-1">
                            Manage and track your potential opportunities.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[300px] relative">
                            <SearchLeads defaultValue={query} />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="bg-white border-slate-200">
                                <Filter className="w-4 h-4 mr-2" /> Filter
                            </Button>
                            <Link href="/crm/leads/new">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm px-6">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Lead
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Leads</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</h3>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Hot Opportunities</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{hotLeadsCount}</h3>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pipeline Value</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalValue, defaultCurrency.code)}</h3>
                        </div>
                        <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                            {defaultCurrency.code === 'INR' ? (
                                <IndianRupee className="h-5 w-5 text-green-600" />
                            ) : (
                                <DollarSign className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <LeadTable
                    data={leads}
                    totalOrCount={totalCount}
                    page={page}
                    limit={limit}
                />
            </div>
        </div>
    )
}
