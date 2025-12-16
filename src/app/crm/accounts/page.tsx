
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Globe, Phone } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Accounts | SAAS ERP',
    description: 'Manage your CRM accounts',
}

export const dynamic = 'force-dynamic'

export default async function AccountsPage() {
    const accounts = await prisma.crm_accounts.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
        include: {
            // Count related contacts/deals if needed, for now keep simple
            contacts: {
                select: { id: true }
            }
        }
    })

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Accounts</h1>
                    <p className="text-gray-500 mt-2">Companies and organizations you work with.</p>
                </div>
                <Link href="/crm/accounts/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div key={account.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {account.industry || 'General'}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {account.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <span>{account.contacts.length} Contacts</span>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            {account.website && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate">
                                        {account.website}
                                    </a>
                                </div>
                            )}
                            {account.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <a href={`tel:${account.phone}`} className="hover:text-blue-600 transition-colors">
                                        {account.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No accounts found.</p>
                        <Link href="/crm/accounts/new">
                            <Button variant="outline">Create First Account</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
