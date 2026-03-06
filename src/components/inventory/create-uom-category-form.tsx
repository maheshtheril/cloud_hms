'use client'

import { createUOMCategory } from "@/app/actions/inventory"
import { Plus, RefreshCw, FolderPlus } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useActionState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
        >
            {pending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
                <Plus className="h-4 w-4" />
            )}
            {pending ? "Adding Category..." : "Add Category"}
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
        <form ref={formRef} action={formAction} className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <FolderPlus className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">New Category</h3>
                    <p className="text-xs text-gray-500 font-medium">Group related units</p>
                </div>
            </div>

            {state?.error && (
                <div className="flexItems-start gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium animate-in fade-in slide-in-from-top-2">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Category added successfully
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Category Name</label>
                <input
                    name="name"
                    required
                    placeholder="e.g. Weight, Volume, Length"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                />
            </div>

            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    )
}
