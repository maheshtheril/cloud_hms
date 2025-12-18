import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, User, Phone, Mail, Building2, Briefcase } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contacts | SAAS ERP',
    description: 'Manage your CRM contacts',
}

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const contacts = await prisma.crm_contacts.findMany({
        where: {
            ...(tenantId ? { tenant_id: tenantId } : {}),
            deleted_at: null
        },
        orderBy: { created_at: 'desc' },
        include: {
            account: {
                select: { name: true }
            }
        }
    })

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contacts</h1>
                    <p className="text-gray-500 mt-2">People you do business with.</p>
                </div>
                <Link href="/crm/contacts/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                    <div key={contact.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            {/* Actions menu could go here */}
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {contact.first_name} {contact.last_name}
                        </h3>

                        {contact.job_title && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Briefcase className="w-3 h-3" />
                                <span>{contact.job_title}</span>
                                {contact.account?.name && (
                                    <>
                                        <span>at</span>
                                        <span className="font-medium text-gray-700">{contact.account.name}</span>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            {contact.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${contact.email} `} className="hover:text-blue-600 transition-colors">
                                        {contact.email}
                                    </a>
                                </div>
                            )}
                            {contact.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <a href={`tel:${contact.phone} `} className="hover:text-blue-600 transition-colors">
                                        {contact.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {contacts.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No contacts found.</p>
                        <Link href="/crm/contacts/new">
                            <Button variant="outline">Create First Contact</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
