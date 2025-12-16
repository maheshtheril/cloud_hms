'use client'

import { useActionState } from "react"
import { createManufacturer } from "@/app/actions/inventory"
import { Plus, Globe } from "lucide-react"

const initialState = {
    error: "",
    success: false
}

export function CreateManufacturerForm() {
    const [state, action, isPending] = useActionState(createManufacturer, initialState)

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Manufacturer
            </h2>
            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {state.error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input
                        name="name"
                        required
                        placeholder="e.g. Pfizer, Tesla, Samsung"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            name="website"
                            placeholder="https://..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Brief details..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                    />
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
                            <Plus className="h-4 w-4" />
                            Add Manufacturer
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
