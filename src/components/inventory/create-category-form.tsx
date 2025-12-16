'use client'

import { useActionState } from "react"
import { createCategory } from "@/app/actions/inventory"
import { Plus, Save } from "lucide-react"

const initialState = {
    error: ""
}

interface CreateCategoryFormProps {
    taxRates: { id: string; name: string; rate: number }[]
}

export function CreateCategoryForm({ taxRates }: CreateCategoryFormProps) {
    const [state, action, isPending] = useActionState(createCategory, initialState)

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Category
            </h2>
            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {state.error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                        name="name"
                        required
                        placeholder="e.g. Antibiotics"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate</label>
                    <select
                        name="taxRateId"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">No Tax</option>
                        {taxRates.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Products in this category will default to this tax rate.</p>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Create Category
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
