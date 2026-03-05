'use client'

import { createUOMCategory } from "@/app/actions/inventory"
import { Plus, RefreshCw, FolderPlus } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useActionState, useRef, useEffect } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gray-900 hover:bg-black text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm text-sm"
        >
            {pending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
                <Plus className="h-4 w-4" />
            )}
            {pending ? "Adding..." : "Add Category"}
        </button>
    )
}

export function CreateUOMCategoryForm() {
    const [state, formAction] = useActionState(createUOMCategory, { error: "", success: false } as any)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state.success])

    return (
        <form ref={formRef} action={formAction} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm border-b pb-2 mb-2">
                <FolderPlus className="h-4 w-4 text-gray-500" />
                New Unit Category
            </h3>

            {state?.error && (
                <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-medium">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-2 bg-emerald-50 text-emerald-600 text-xs rounded-lg border border-emerald-100 font-medium flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Category added
                </div>
            )}

            <div className="space-y-1.5">
                <input
                    name="name"
                    required
                    placeholder="e.g. Weight, Volume, Length"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                />
            </div>

            <div className="pt-1">
                <SubmitButton />
            </div>
        </form>
    )
}
