'use client'

import { createUOM, updateUOM } from "@/app/actions/inventory"
import { Scale, RefreshCw, X } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useState, useRef, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none mt-4"
        >
            {pending ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
                <Scale className="h-5 w-5" />
            )}
            {pending ? "Saving Unit..." : isEdit ? "Update Unit" : "Create Unit"}
        </button>
    )
}

export function CreateUOMForm({ initialData }: { initialData?: any }) {
    const [state, formAction] = useActionState(initialData ? updateUOM : createUOM, { error: "", success: false })
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const [name, setName] = useState(initialData?.name || "");

    useEffect(() => {
        if (state.success && !initialData) {
            formRef.current?.reset();
            setName("");
        }
    }, [state.success, initialData])

    return (
        <form ref={formRef} action={formAction} className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            {initialData && <input type="hidden" name="id" value={initialData.id} />}

            {/* Error & Success States */}
            {state?.error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <X className="h-5 w-5 flex-shrink-0" />
                    {state.error}
                </div>
            )}
            {state?.success && !initialData && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200 font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    Unit saved successfully.
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Unit Name
                    </label>
                    <input
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dozen, Pack, Palette, Piece"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-900 shadow-sm"
                    />
                </div>

                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    )
}
