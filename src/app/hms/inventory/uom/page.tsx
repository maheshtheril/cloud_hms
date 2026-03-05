import { getUOMs, getUOMCategories, deleteUOM } from "@/app/actions/inventory"
import { Scale, X, Ruler, Trash2, Box, Layers } from "lucide-react"
import Link from "next/link"
import { CreateUOMForm } from "@/components/inventory/create-uom-form"

export default async function UOMMasterPage() {
    const uoms = await getUOMs();
    const categories = await getUOMCategories();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-purple-600 rounded-lg shadow-sm">
                                    <Scale className="h-6 w-6 text-white" />
                                </div>
                                Units of Measure (UOM)
                            </h1>
                            <p className="text-gray-500 max-w-2xl text-lg">
                                Standard units for inventory tracking and sales.
                            </p>
                        </div>
                        <Link
                            href="/hms/inventory/products"
                            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all font-medium shadow-sm"
                        >
                            <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            Close Manager
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Create Form */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                                        Add New Unit
                                    </h3>
                                </div>
                                <div className="p-2">
                                    <CreateUOMForm categories={categories} />
                                </div>
                            </div>

                            <div className="mt-6 p-5 bg-purple-50 rounded-2xl border border-purple-100 text-purple-800 text-sm leading-relaxed">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Layers className="h-4 w-4" />
                                    How Units Work
                                </h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>Reference Unit:</strong> Base unit (e.g. Piece, Kg)</li>
                                    <li><strong>Bigger Unit:</strong> e.g. Dozen (Ratio = 12)</li>
                                    <li><strong>Smaller Unit:</strong> e.g. Gram (Ratio = 0.001)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Active Units
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                                    {uoms.length}
                                </span>
                            </h2>
                        </div>

                        {uoms.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                                <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Box className="h-8 w-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No UOMs Yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Create your first Unit of Measure to start tracking inventory.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {uoms.map((u: any) => {
                                    const category = categories.find((c: any) => c.id === u.category_id);

                                    return (
                                        <div
                                            key={u.id}
                                            className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-purple-200/50 transition-all duration-300 flex flex-col justify-between h-full"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-purple-600 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                                                    <Ruler className="h-5 w-5" />
                                                </div>
                                                <form action={async () => {
                                                    'use server'
                                                    await deleteUOM(u.id)
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all transform scale-90 group-hover:scale-100"
                                                        title="Delete Unit"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                                                    {u.name}
                                                    {u.uom_type === 'reference' && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
                                                            Ref
                                                        </span>
                                                    )}
                                                </h3>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 flex-shrink-0">
                                                        Cat: {category?.name || "Unknown"}
                                                    </div>

                                                    {u.uom_type !== 'reference' && (
                                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 font-mono">
                                                            Ratio: {Number(u.ratio)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
