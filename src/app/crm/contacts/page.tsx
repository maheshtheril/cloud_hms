import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, User, Phone, Mail, Building2, Briefcase, Users, MapPin, Star } from 'lucide-react'
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
    title: 'Contacts | Cloud HMS',
    description: 'Manage your CRM contacts with AI intelligence',
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

    const companiesCount = new Set(contacts.filter(c => c.account?.name).map(c => c.account?.name)).size
    const withEmailCount = contacts.filter(c => c.email).length
    const withPhoneCount = contacts.filter(c => c.phone).length

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-gradient-primary">
                            <Users className="h-8 w-8 text-blue-400 dark:text-blue-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient-primary">
                                Contacts
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                Your business network • {contacts.length} total contacts
                            </p>
                        </div>
                    </div>
                    <Link href="/crm/contacts/new">
                        <Button className="btn-futuristic-primary">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <Plus className="w-4 h-4 mr-2" />
                            Add Contact
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Contacts</p>
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {contacts.length}
                        </div>
                    </div>

                    <div className="card-stat-cyan p-6 rounded-2xl shadow-xl hover-glow-cyan transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Companies</p>
                            <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {companiesCount}
                        </div>
                    </div>

                    <div className="glass border-gradient-accent bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/50 dark:to-transparent p-6 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Reachable</p>
                            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {Math.round((withEmailCount / Math.max(contacts.length, 1)) * 100)}%
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {withEmailCount} with email
                        </p>
                    </div>
                </div>

                {/* Contacts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Avatar with gradient background */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="relative">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 dark:border-blue-400/30 shadow-lg shadow-blue-500/20">
                                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {/* Premium badge if contact has complete info */}
                                    {contact.email && contact.phone && (
                                        <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                                {contact.first_name} {contact.last_name}
                            </h3>

                            {/* Job Title & Company */}
                            {contact.job_title && (
                                <div className="flex items-center gap-2 text-sm mb-4">
                                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                        {contact.job_title}
                                    </span>
                                    {contact.account?.name && (
                                        <>
                                            <span className="text-slate-500 dark:text-slate-400">at</span>
                                            <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/30">
                                                {contact.account.name}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                {contact.email && (
                                    <div className="group/item flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate flex-1 font-medium"
                                        >
                                            {contact.email}
                                        </a>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="group/item flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                            <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                                        >
                                            {contact.phone}
                                        </a>
                                    </div>
                                )}
                                {!contact.email && !contact.phone && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-2">
                                        No contact info
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {contacts.length === 0 && (
                        <div className="col-span-full">
                            <div className="card-futuristic text-center py-16">
                                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 mb-6">
                                    <Users className="h-16 w-16 text-blue-400 mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    No Contacts Yet
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto">
                                    Start building your business network with smart contact management
                                </p>
                                <Link href="/crm/contacts/new">
                                    <Button className="btn-futuristic-primary">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Contact
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
