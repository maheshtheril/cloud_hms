'use client'

import { createUOM, updateUOM } from "@/app/actions/inventory"
import { Scale, RefreshCw, Box, ArrowRight, X } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useState, useRef, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
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

export function CreateUOMForm({ categories, initialData }: { categories: any[], initialData?: any }) {
    const [state, formAction] = useActionState(initialData ? updateUOM : createUOM, { error: "", success: false })
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    // Derived states
    const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ""));
    const [uomType, setUomType] = useState(initialData?.uom_type || "reference");
    const [ratio, setRatio] = useState(initialData?.ratio || 1);
    const [name, setName] = useState(initialData?.name || "");

    useEffect(() => {
        if (state.success && !initialData) {
            formRef.current?.reset();
            setRatio(1);
            setUomType("reference");
            setName("");
        }
    }, [state.success, initialData])

    // Find reference unit for selected category
    const refUom = categories.find(c => c.id === categoryId)?.hms_uom?.find((u: any) => u.uom_type === 'reference');
    const refName = refUom ? refUom.name : "Base Unit";

    const isReference = uomType === 'reference';

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
                    Unit saved successfully. You can create another one!
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            Category Definition
                        </label>
                        <select
                            name="categoryId"
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all appearance-none font-semibold text-gray-900 shadow-sm"
                        >
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unit Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Unit Name
                        </label>
                        <input
                            name="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dozen, Pack, Palette"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Type Selection Cards */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Unit Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Reference Option */}
                        <div
                            onClick={() => { setUomType('reference'); setRatio(1); }}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${isReference
                                    ? 'border-purple-500 bg-purple-50/50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold ${isReference ? 'text-purple-900' : 'text-gray-900'}`}>Base Unit</span>
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${isReference ? 'border-purple-500' : 'border-gray-300'
                                    }`}>
                                    {isReference && <div className="h-2 w-2 bg-purple-500 rounded-full" />}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Standard core unit (e.g. Piece, Kg, Liter).</p>
                        </div>

                        {/* Non-Reference Option */}
                        <div
                            onClick={() => { setUomType('bigger'); }}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${!isReference
                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold ${!isReference ? 'text-blue-900' : 'text-gray-900'}`}>Derived Unit</span>
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${!isReference ? 'border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {!isReference && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Multiples of the base (e.g. Dozen, Pack of 10).</p>
                        </div>
                    </div>
                    {/* Hidden input to pass selected type to action */}
                    <input type="hidden" name="type" value={uomType} />
                </div>

                {/* Dynamic Ratio Builder (only if not reference) */}
                {!isReference && (
                    <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/60 rounded-xl shadow-inner animate-in fade-in slide-in-from-top-4">
                        <label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            Conversion Logic
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex-1 w-full text-center sm:text-left bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-500 font-medium block mb-1">This Unit</span>
                                <span className="font-bold text-gray-900 text-lg">1 {name || "[Unit]"}</span>
                            </div>

                            <div className="flex items-center justify-center p-2 bg-blue-100 rounded-full text-blue-600">
                                <ArrowRight className="h-5 w-5" />
                            </div>

                            <div className="flex-1 w-full relative">
                                <label className="text-xs text-blue-600 font-bold block mb-1.5 ml-1">Equals Base Units</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="ratio"
                                        type="number"
                                        step="0.000001"
                                        min="0.000001"
                                        required
                                        value={ratio}
                                        onChange={(e) => setRatio(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-mono text-xl text-blue-900 font-bold shadow-sm pr-20"
                                    />
                                    <span className="absolute right-4 font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded text-sm">
                                        {refName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <SubmitButton isEdit={!!initialData} />
                </div>
            </div>
        </form>
    )
}
