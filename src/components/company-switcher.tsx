'use client'

import { useState, useEffect } from 'react'
import { Building2, ChevronDown, Check, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getTenantCompanies, switchCompany } from '@/app/actions/company'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function CompanySwitcher({
    initialActiveCompany
}: {
    initialActiveCompany?: { id: string, name: string } | null
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [companies, setCompanies] = useState<any[]>([])
    // We can use a client-side polling or just fetch on mount.
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function load() {
            const res = await getTenantCompanies()
            if (res.success && res.data) {
                setCompanies(res.data)
            }
        }
        if (isOpen && companies.length === 0) {
            load()
        }
    }, [isOpen, companies.length])

    const { update } = useSession()

    const handleSwitch = async (companyId: string) => {
        setLoading(true)
        const res = await switchCompany(companyId)
        if (res.success) {
            // Update the session cookie immediately
            await update({ companyId })

            setIsOpen(false)
            router.refresh()
            // Robustness: Sometimes a hard refresh is better for clearing deep state
            // window.location.reload() 
        } else {
            alert('Failed to switch company')
        }
        setLoading(false)
    }

    const activeCompany = initialActiveCompany || { name: 'Select Company' }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 w-full text-left transition-colors"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                }}
            >
                <div className="flex items-center justify-center h-8 w-8 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                    <Building2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>
                        {activeCompany.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#94a3b8' }}>Switch Organization</p>
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white rounded-lg shadow-lg border border-gray-100 py-1 max-h-64 overflow-y-auto w-64">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            My Companies
                        </div>
                        {companies.map(company => (
                            <button
                                key={company.id}
                                onClick={() => handleSwitch(company.id)}
                                disabled={loading}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 group"
                            >
                                <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <Building2 size={12} />
                                </div>
                                <span className={`flex-1 text-sm ${company.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {company.name}
                                </span>
                                {/* Add Check if active */}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <Link
                                href="/hms/settings/companies/new"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <Plus size={14} />
                                Create New Company
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
