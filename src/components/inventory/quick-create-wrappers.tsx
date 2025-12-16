'use client'

import { useActionState } from "react"
import { createCategory, createManufacturer, createUOM } from "@/app/actions/inventory"
import { useEffect } from "react"

const initialState = {
    error: "",
    success: false
}

export function QuickCategoryForm({ onSuccess }: { onSuccess: () => void }) {
    const [state, action, isPending] = useActionState(createCategory, initialState)

    useEffect(() => {
        if (state?.success) {
            onSuccess();
        }
    }, [state?.success, onSuccess]);

    return (
        <form action={action} className="space-y-4">
            {state?.error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            {/* Simplified for quick create - typically we might want tax rate too but keep it simple for modal */}
            <input type="hidden" name="taxRateId" value="" />

            <button type="submit" disabled={isPending} className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                {isPending ? 'Creating...' : 'Create Category'}
            </button>
        </form>
    )
}

export function QuickManufacturerForm({ onSuccess }: { onSuccess: () => void }) {
    const [state, action, isPending] = useActionState(createManufacturer, initialState)

    useEffect(() => {
        if (state?.success) {
            onSuccess();
        }
    }, [state?.success, onSuccess]);

    return (
        <form action={action} className="space-y-4">
            {state?.error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Name</label>
                <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <button type="submit" disabled={isPending} className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                {isPending ? 'Creating...' : 'Create Manufacturer'}
            </button>
        </form>
    )
}
