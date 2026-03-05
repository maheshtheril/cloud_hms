'use client'

import { createUOM, updateUOM } from "@/app/actions/inventory"
import { Scale, RefreshCw } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useState, useRef, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
        >
            {pending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
                <Scale className="h-4 w-4" />
            )}
            {pending ? "Saving..." : isEdit ? "Update Unit" : "Create Unit"}
        </button>
    )
}

export function CreateUOMForm({ categories, initialData }: { categories: any[], initialData?: any }) {
    const [state, formAction] = useActionState(initialData ? updateUOM : createUOM, { error: "", success: false })
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    // Derived states
    const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ""));
    const [uomType, setUomType] = useState(initialData?.uom_type || "reference");
    const [ratio, setRatio] = useState(initialData?.ratio || 1);

    useEffect(() => {
        if (state.success && !initialData) {
            formRef.current?.reset();
            setRatio(1);
            setUomType("reference");
        }
    }, [state.success, initialData])

    // Find reference unit for selected category
    const refUom = categories.find(c => c.id === categoryId)?.hms_uom?.find((u: any) => u.uom_type === 'reference');
    const refName = refUom ? refUom.name : "Base Unit";

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            {initialData && <input type="hidden" name="id" value={initialData.id} />}

            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                    {state.error}
                </div>
            )}
            {state?.success && !initialData && (
                <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100 font-medium flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Unit saved successfully
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Category / Dimension</label>
                <select
                    name="categoryId"
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none font-medium"
                >
                    {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Unit Name</label>
                <input
                    name="name"
                    required
                    defaultValue={initialData?.name}
                    placeholder="e.g. Dozen, Pack, Palette"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Unit Type</label>
                <select
                    name="type"
                    required
                    value={uomType}
                    onChange={(e) => {
                        setUomType(e.target.value);
                        if (e.target.value === 'reference') setRatio(1);
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none font-medium"
                >
                    <option value="reference">Reference Unit (Base)</option>
                    <option value="bigger">Bigger than reference</option>
                    <option value="smaller">Smaller than reference</option>
                </select>
            </div>

            {uomType !== 'reference' && (
                <div className="space-y-1.5 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <label className="text-sm font-bold text-gray-900 block mb-2">Conversion Ratio</label>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-600 whitespace-nowrap">
                            1 Unit =
                        </span>
                        <input
                            name="ratio"
                            type="number"
                            step="0.000001"
                            min="0.000001"
                            required
                            value={ratio}
                            onChange={(e) => setRatio(Number(e.target.value))}
                            className="flex-1 w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                        />
                        <span className="font-semibold text-gray-700 whitespace-nowrap min-w-[60px]">
                            {refName}
                        </span>
                    </div>
                    {uomType === 'smaller' && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                            Example: If base is kg and this is gram, ratio is 0.001
                        </p>
                    )}
                </div>
            )}

            <div className="pt-2">
                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    )
}
