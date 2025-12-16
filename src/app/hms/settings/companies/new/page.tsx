'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompany } from '@/app/actions/company'
import { Building2, Globe, Wallet, ChevronRight } from 'lucide-react'

export default function NewCompanyPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        country_id: '',
        currency_id: '',
        tax_id: ''
    })

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await createCompany(formData)
            if (res.success) {
                router.push('/hms/settings/companies')
                router.refresh()
            } else {
                setError(res.error || 'Failed to create company')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { num: 1, title: 'Identity', icon: Building2 },
        { num: 2, title: 'Location', icon: Globe },
        { num: 3, title: 'Finance', icon: Wallet },
    ]

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Establish New Company</h1>
                <p className="text-gray-500">Expand your organization by adding a new legal entity.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10" />
                {steps.map((s) => (
                    <div key={s.num} className="flex flex-col items-center bg-gray-50 px-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.num
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            <s.icon size={18} />
                        </div>
                        <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Acme Corp (Europe)"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                            <select
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Industry...</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="retail">Retail</option>
                                <option value="services">Professional Services</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                            Selecting the correct country ensures accurate tax regulations and compliance reporting.
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            {/* Ideally fetch countries from DB */}
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                            >
                                <option value="">Select Country...</option>
                                <option value="us">United States</option>
                                <option value="in">India</option>
                                <option value="uk">United Kingdom</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-700">
                            <strong>Note:</strong> The base currency cannot be changed once transactions are recorded.
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({ ...formData, currency_id: e.target.value })}
                            >
                                <option value="">Select Currency...</option>
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / TIN (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Registration Number"
                                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        className={`px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors ${step === 1 ? 'invisible' : ''}`}
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                            disabled={step === 1 && !formData.name}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Company'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
